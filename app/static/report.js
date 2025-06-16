/**
 * Report Builder Class with Query Metadata Extraction
 * Handles all report creation and editing functionality
 */
class ReportBuilder {
    constructor(config) {
        // Map all URLs from config using snake_case
        this.urls = {
            data_api:                 config.data_api,
            execute_report:           config.execute_report,
            test_report:              config.test_report,
            preview_report:           config.preview_report,
            export_report:            config.export_report,
            get_report_permissions:   config.get_report_permissions,
            assign_report:            config.assign_report,
            validate_query:           config.validate_query,
            detect_variables:         config.detect_variables,
            list_report_templates:    config.list_report_templates,
            create_report_template:   config.create_report_template,
            update_report_template:   config.update_report_template,
            delete_report_template:   config.delete_report_template,
            test_connection:          config.test_connection,
            get_stats:                config.get_stats,
            export_report_definition: config.export_report_definition,
            import_report:            config.import_report,
            reorder_columns:          config.reorder_columns,
            validate_variables:       config.validate_variables,
            // New metadata URLs
            query_metadata:           config.query_metadata,
            analyze_columns:          config.analyze_columns,
            sync_columns:             config.sync_columns,
            analyze_query:            config.analyze_query,
            detect_column_types:      config.detect_column_types,
            suggest_column_settings:  config.suggest_column_settings
        };

        // Configuration
        this.report_id = config.reportId || null;
        this.is_edit_mode = !!this.report_id;

        // Token manager reference
        this.token_manager = window.token_manager || null;

        // State
        this.query_editor = null;
        this.report_data = {
            report: null,
            columns: [],
            variables: [],
            data_types: {},
            variable_types: {},
            connections: [],
            templates: [],
            categories: [],
            pending_column_analysis: null // Store analysis results
        };

        // Initialize
        this.init();
    }

    /**
     * Get headers with proper authentication
     */
    get_auth_headers() {
        const headers = {
            'Content-Type': 'application/json'
        };

        // Add API token if available
        if (this.token_manager && this.token_manager.get_tokens()?.api_token) {
            headers['Authorization'] = `Bearer ${this.token_manager.get_tokens().api_token}`;
        }

        // Add CSRF token if available
        const csrf_token = document.querySelector('meta[name="csrf-token"]')?.content;
        if (csrf_token) {
            headers['X-CSRF-Token'] = csrf_token;
        }

        return headers;
    }

    /**
     * Make authenticated API request
     */
    async api_request(url, options = {}) {
        const default_options = {
            method: 'POST',
            headers: this.get_auth_headers()
        };

        const final_options = { ...default_options, ...options };

        // If there's a body and it's an object, stringify it
        if (final_options.body && typeof final_options.body === 'object') {
            final_options.body = JSON.stringify(final_options.body);
        }

        try {
            const response = await fetch(url, final_options);
            const result = await response.json();

            // Check if response indicates success
            if (!result.success && result.error) {
                throw new Error(result.error);
            }

            return result;
        } catch (error) {
            console.error('API request error:', error);
            throw error;
        }
    }

    async init() {
        try {
            // Initialize CodeMirror
            this.init_query_editor();

            // Load initial data
            await Promise.all([
                this.load_connections(),
                this.load_report_templates(),
                this.load_data_types(),
                this.load_variable_types()
            ]);

            // If editing, load existing report
            if (this.is_edit_mode) {
                await this.load_existing_report();
            }

            // Load categories from existing reports
            await this.load_categories();

            // Setup event handlers
            this.setup_event_handlers();

            console.log('Report Builder initialized successfully');
        } catch (error) {
            console.error('Failed to initialize Report Builder:', error);
            this.show_error('Failed to initialize Report Builder: ' + error.message);
        }
    }

    init_query_editor() {
        this.query_editor = CodeMirror(document.getElementById('queryEditor'), {
            mode: 'text/x-sql',
            theme: 'monokai',
            lineNumbers: true,
            lineWrapping: true,
            value: '-- Enter your SQL query here\nSELECT * FROM table_name WHERE date >= :start_date'
        });
    }

    setup_event_handlers() {
        // Auto-generate slug from name
        $('#reportName').on('input', (e) => {
            if (!this.is_edit_mode) {
                const slug = $(e.target).val()
                    .toLowerCase()
                    .replace(/[^a-z0-9]+/g, '-')
                    .replace(/^-|-$/g, '');
                $('#reportSlug').val(slug);
            }
        });

        // Button click handlers
        $('#testQueryBtn').on('click', () => this.test_query_with_metadata());
        $('#detectVariablesBtn').on('click', () => this.detect_variables());
        $('#formatQueryBtn').on('click', () => this.format_query());
        $('#addColumnBtn').on('click', () => this.add_column());
        $('#addVariableBtn').on('click', () => this.add_variable());
        $('#runPreviewBtn').on('click', () => this.run_preview());
        $('#saveReportBtn').on('click', () => this.save_report());
        $('#saveDraftBtn').on('click', () => this.save_draft());
        
        // New metadata buttons
        $('#analyzeColumnsBtn').on('click', () => this.analyze_columns_from_query());
        $('#syncColumnsBtn').on('click', () => this.sync_columns_from_query());
        $('#autoDetectTypesBtn').on('click', () => this.auto_detect_column_types());

        // Tab change handler
        $('button[data-bs-toggle="pill"]').on('shown.bs.tab', (e) => {
            const target = $(e.target).attr('data-bs-target');
            if (target === '#preview') {
                this.prepare_preview();
            } else if (target === '#columns' && this.report_data.pending_column_analysis) {
                // If we have pending column analysis, show it
                this.show_column_analysis_results();
            }
        });
    }

    // Data Loading Methods (unchanged)
    async load_connections() {
        try {
            const result = await this.api_request(this.urls.data_api, {
                body: {
                    model: 'Connection',
                    operation: 'list'
                }
            });

            if (result.success) {
                this.report_data.connections = result.data;
                const select = $('#reportConnection');
                select.empty().append('<option value="">Select a connection...</option>');

                result.data.forEach(conn => {
                    select.append(`<option value="${conn.uuid}">${conn.name} (${conn.db_type})</option>`);
                });
            }
        } catch (error) {
            console.error('Failed to load connections:', error);
            this.show_error('Failed to load database connections');
        }
    }

    async load_report_templates() {
        try {
            const result = await this.api_request(this.urls.list_report_templates, {
                body: {}
            });

            if (result.success && result.data) {
                this.report_data.templates = result.data;
                const select = $('#reportTemplate');
                select.empty().append('<option value="">Default template</option>');

                result.data.forEach(template => {
                    select.append(`<option value="${template.uuid}">${template.display_name}</option>`);
                });
            }
        } catch (error) {
            console.error('Failed to load report templates:', error);
        }
    }

    async load_data_types() {
        try {
            const result = await this.api_request(this.urls.data_api, {
                body: {
                    model: 'DataType',
                    operation: 'list'
                }
            });

            if (result.success) {
                result.data.forEach(dt => {
                    this.report_data.data_types[dt.uuid] = dt;
                });
            }
        } catch (error) {
            console.error('Failed to load data types:', error);
        }
    }

    async load_variable_types() {
        try {
            const result = await this.api_request(this.urls.data_api, {
                body: {
                    model: 'VariableType',
                    operation: 'list'
                }
            });

            if (result.success) {
                result.data.forEach(vt => {
                    this.report_data.variable_types[vt.uuid] = vt;
                });
            }
        } catch (error) {
            console.error('Failed to load variable types:', error);
        }
    }

    async load_categories() {
        try {
            const result = await this.api_request(this.urls.get_stats, {
                body: {}
            });

            if (result.success && result.data.categories) {
                this.report_data.categories = Object.keys(result.data.categories).filter(c => c);

                const datalist = $('#categoryList');
                datalist.empty();
                this.report_data.categories.forEach(cat => {
                    datalist.append(`<option value="${cat}">`);
                });
            }
        } catch (error) {
            console.error('Failed to load categories:', error);
        }
    }

    async load_existing_report() {
        try {
            // Export the report definition
            const result = await this.api_request(this.urls.export_report_definition, {
                body: {
                    report_id: this.report_id
                }
            });

            if (result.success && result.data) {
                const definition = result.data;
                this.report_data.report = definition.report;

                // Populate basic fields
                $('#reportName').val(definition.report.name);
                $('#reportSlug').val(definition.report.slug);
                $('#reportDisplay').val(definition.report.display || '');
                $('#reportDescription').val(definition.report.description || '');
                $('#reportCategory').val(definition.report.category || '');
                $('#reportTags').val(definition.report.tags ? definition.report.tags.join(', ') : '');

                // Set query
                this.query_editor.setValue(definition.report.query);

                // Set flags
                const flags = definition.report.flags || {};
                $('#isWide').prop('checked', flags.is_wide);
                $('#isAjax').prop('checked', flags.is_ajax);
                $('#isAutoRun').prop('checked', flags.is_auto_run);
                $('#isSearchable').prop('checked', flags.is_searchable);
                $('#isPublic').prop('checked', flags.is_public);
                $('#isDownloadCsv').prop('checked', flags.is_download_csv);
                $('#isDownloadXlsx').prop('checked', flags.is_download_xlsx);

                // Set options
                const options = definition.report.options || {};
                $('#resultsLimit').val(options.results_limit || 0);
                $('#cacheMinutes').val(options.cache_duration_minutes || 60);

                // Set connection and template
                $('#reportConnection').val(definition.report.connection_id || '');
                $('#reportTemplate').val(definition.report.report_template_id || '');

                // Process columns and variables
                this.report_data.columns = definition.columns || [];
                this.report_data.variables = definition.variables || [];

                // Map data type names back to UUIDs
                this.report_data.columns.forEach(col => {
                    const data_type = Object.values(this.report_data.data_types).find(dt => dt.name === col.data_type);
                    if (data_type) col.data_type_id = data_type.uuid;
                });

                this.report_data.variables.forEach(variable => {
                    const var_type = Object.values(this.report_data.variable_types).find(vt => vt.name === variable.variable_type);
                    const data_type = Object.values(this.report_data.data_types).find(dt => dt.name === variable.data_type);
                    if (var_type) variable.variable_type_id = var_type.uuid;
                    if (data_type) variable.data_type_id = data_type.uuid;
                });

                this.render_columns();
                this.render_variables();
            }
        } catch (error) {
            console.error('Failed to load existing report:', error);
            this.show_error('Failed to load report data: ' + error.message);
        }
    }

    // Enhanced Query Operations with Metadata
    async test_query_with_metadata() {
        const query = this.query_editor.getValue();
        const connection_id = $('#reportConnection').val();

        if (!query || !connection_id) {
            this.show_error('#queryTestResult', 'Please select a connection and enter a query');
            return;
        }

        this.show_loading(true);
        $('#queryTestResult').html('<div class="alert alert-info">Validating query and extracting metadata...</div>');

        try {
            // First validate the query
            const validate_result = await this.api_request(this.urls.validate_query, {
                body: {
                    query: query,
                    connection_id: connection_id
                }
            });

            if (!validate_result.success) {
                throw new Error(validate_result.error || 'Query validation failed');
            }

            // Query is valid, now extract metadata
            const metadata_result = await this.api_request(this.urls.query_metadata, {
                body: {
                    query: query,
                    connection_id: connection_id,
                    params: {}
                }
            });

            if (metadata_result.success && metadata_result.data.columns) {
                const columns = metadata_result.data.columns;
                
                // Auto-populate columns with metadata
                this.report_data.columns = await this.create_columns_from_metadata(columns);
                
                this.render_columns();
                
                // Show success with column count
                const message = `
                    <div class="alert alert-success">
                        <strong>Query validated successfully!</strong><br>
                        Found ${columns.length} columns. Column definitions have been auto-populated.
                        <button class="btn btn-sm btn-primary ms-2" onclick="$('#columns-tab').tab('show')">
                            View Columns
                        </button>
                    </div>
                `;
                $('#queryTestResult').html(message);
                
                // Also detect variables
                await this.detect_variables();
            }
        } catch (error) {
            this.show_error('#queryTestResult', 'Query validation failed: ' + error.message);
        } finally {
            this.show_loading(false);
        }
    }

    async create_columns_from_metadata(metadata_columns) {
        const columns = [];
        
        for (let idx = 0; idx < metadata_columns.length; idx++) {
            const meta_col = metadata_columns[idx];
            
            // Get suggested settings for this column
            let suggestions = {};
            if (this.urls.suggest_column_settings) {
                try {
                    const suggest_result = await this.api_request(this.urls.suggest_column_settings, {
                        body: {
                            column_name: meta_col.name,
                            column_type: meta_col.type
                        }
                    });
                    
                    if (suggest_result.success) {
                        suggestions = suggest_result.data;
                    }
                } catch (error) {
                    console.warn('Failed to get column suggestions:', error);
                }
            }
            
            // Find data type UUID
            const data_type = Object.values(this.report_data.data_types).find(dt => dt.name === meta_col.type);
            
            columns.push({
                name: meta_col.name,
                display_name: suggestions.display_name || meta_col.name.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
                data_type_id: data_type ? data_type.uuid : this.get_default_data_type(meta_col.sql_type),
                order_index: idx,
                is_searchable: suggestions.is_searchable !== undefined ? suggestions.is_searchable : true,
                is_visible: suggestions.is_visible !== undefined ? suggestions.is_visible : true,
                is_sortable: suggestions.is_sortable !== undefined ? suggestions.is_sortable : true,
                alignment: suggestions.alignment || 'left',
                format_string: suggestions.format_string || null,
                search_type: suggestions.search_type || 'contains',
                width: null,
                options: {}
            });
        }
        
        return columns;
    }

    async analyze_columns_from_query() {
        if (!this.is_edit_mode) {
            this.show_error('Save the report first to analyze columns');
            return;
        }

        this.show_loading(true);

        try {
            const result = await this.api_request(this.urls.analyze_columns, {
                body: {
                    report_id: this.report_id,
                    auto_update: false,
                    dry_run: true
                }
            });

            if (result.success && result.data) {
                this.report_data.pending_column_analysis = result.data;
                this.show_column_analysis_results();
            }
        } catch (error) {
            this.show_error('Failed to analyze columns: ' + error.message);
        } finally {
            this.show_loading(false);
        }
    }

    show_column_analysis_results() {
        const analysis = this.report_data.pending_column_analysis;
        if (!analysis) return;

        let html = '<div class="card"><div class="card-body">';
        html += '<h5 class="card-title">Column Analysis Results</h5>';

        // Summary
        const summary = analysis.summary;
        html += `
            <div class="row mb-3">
                <div class="col-md-3">
                    <div class="text-center">
                        <h3>${summary.total_query_columns}</h3>
                        <small class="text-muted">Query Columns</small>
                    </div>
                </div>
                <div class="col-md-3">
                    <div class="text-center">
                        <h3>${summary.total_existing_columns}</h3>
                        <small class="text-muted">Existing Columns</small>
                    </div>
                </div>
                <div class="col-md-3">
                    <div class="text-center">
                        <h3 class="text-success">${summary.new_columns_count}</h3>
                        <small class="text-muted">New Columns</small>
                    </div>
                </div>
                <div class="col-md-3">
                    <div class="text-center">
                        <h3 class="text-warning">${summary.type_changes_count}</h3>
                        <small class="text-muted">Type Changes</small>
                    </div>
                </div>
            </div>
        `;

        // New columns
        if (analysis.new_columns.length > 0) {
            html += '<h6>New Columns Found:</h6><ul>';
            analysis.new_columns.forEach(col => {
                html += `<li><strong>${col.name}</strong> (suggested type: ${col.suggested_type})</li>`;
            });
            html += '</ul>';
        }

        // Type changes
        if (analysis.type_changes.length > 0) {
            html += '<h6>Type Changes Suggested:</h6><ul>';
            analysis.type_changes.forEach(change => {
                html += `<li><strong>${change.name}</strong>: ${change.current_type} → ${change.suggested_type}</li>`;
            });
            html += '</ul>';
        }

        // Missing columns
        if (analysis.missing_columns.length > 0) {
            html += '<h6 class="text-danger">Columns Not Found in Query:</h6><ul>';
            analysis.missing_columns.forEach(col => {
                html += `<li>${col}</li>`;
            });
            html += '</ul>';
        }

        // Actions
        if (summary.new_columns_count > 0 || summary.type_changes_count > 0) {
            html += `
                <div class="mt-3">
                    <button class="btn btn-primary" onclick="window.reportBuilder.apply_column_analysis()">
                        Apply Changes
                    </button>
                    <button class="btn btn-secondary ms-2" onclick="window.reportBuilder.dismiss_column_analysis()">
                        Dismiss
                    </button>
                </div>
            `;
        }

        html += '</div></div>';

        // Show in a dedicated area or modal
        $('#columnAnalysisResults').html(html);
        
        // Show alert in columns tab
        const alert_html = `
            <div class="alert alert-info alert-dismissible">
                Found ${summary.new_columns_count} new columns and ${summary.type_changes_count} type changes.
                <a href="#" onclick="$('#columnAnalysisResults').toggle(); return false;">View Details</a>
                <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
            </div>
        `;
        $('#columnsTabAlerts').html(alert_html);
    }

    async apply_column_analysis() {
        if (!this.report_data.pending_column_analysis) return;

        this.show_loading(true);

        try {
            const result = await this.api_request(this.urls.analyze_columns, {
                body: {
                    report_id: this.report_id,
                    auto_update: true,
                    dry_run: false
                }
            });

            if (result.success) {
                this.show_success('Column changes applied successfully!');
                
                // Reload report to get updated columns
                await this.load_existing_report();
                
                // Clear analysis
                this.report_data.pending_column_analysis = null;
                $('#columnAnalysisResults').empty();
                $('#columnsTabAlerts').empty();
            }
        } catch (error) {
            this.show_error('Failed to apply column changes: ' + error.message);
        } finally {
            this.show_loading(false);
        }
    }

    dismiss_column_analysis() {
        this.report_data.pending_column_analysis = null;
        $('#columnAnalysisResults').empty();
        $('#columnsTabAlerts').empty();
    }

    async sync_columns_from_query() {
        if (!this.is_edit_mode) {
            this.show_error('Save the report first to sync columns');
            return;
        }

        const remove_missing = confirm(
            'Sync columns with query?\n\n' +
            'This will:\n' +
            '• Add any new columns from the query\n' +
            '• Update column types based on the query\n' +
            '• Reorder columns to match the query\n\n' +
            'Remove columns not in the query?'
        );

        this.show_loading(true);

        try {
            const result = await this.api_request(this.urls.sync_columns, {
                body: {
                    report_id: this.report_id,
                    remove_missing: remove_missing
                }
            });

            if (result.success && result.data) {
                const summary = result.data.summary;
                let message = 'Sync completed:\n';
                
                if (summary.added_count > 0) {
                    message += `• Added ${summary.added_count} columns\n`;
                }
                if (summary.updated_count > 0) {
                    message += `• Updated ${summary.updated_count} columns\n`;
                }
                if (summary.removed_count > 0) {
                    message += `• Removed ${summary.removed_count} columns\n`;
                }
                if (summary.columns_reordered) {
                    message += '• Reordered columns to match query\n';
                }

                this.show_success(message);
                
                // Reload columns
                await this.load_existing_report();
            }
        } catch (error) {
            this.show_error('Failed to sync columns: ' + error.message);
        } finally {
            this.show_loading(false);
        }
    }

    async auto_detect_column_types() {
        if (!this.is_edit_mode) {
            this.show_error('Save the report first to detect column types');
            return;
        }

        this.show_loading(true);

        try {
            const result = await this.api_request(this.urls.detect_column_types, {
                body: {
                    report_id: this.report_id,
                    sample_size: 100
                }
            });

            if (result.success && result.data.columns) {
                // Show type detection results
                this.show_type_detection_results(result.data);
            }
        } catch (error) {
            this.show_error('Failed to detect column types: ' + error.message);
        } finally {
            this.show_loading(false);
        }
    }

    show_type_detection_results(data) {
        let html = '<div class="modal fade" id="typeDetectionModal" tabindex="-1">';
        html += '<div class="modal-dialog modal-lg"><div class="modal-content">';
        html += '<div class="modal-header"><h5 class="modal-title">Column Type Detection Results</h5>';
        html += '<button type="button" class="btn-close" data-bs-dismiss="modal"></button></div>';
        html += '<div class="modal-body">';
        
        html += '<table class="table table-sm">';
        html += '<thead><tr><th>Column</th><th>Current Type</th><th>Detected Type</th><th>Confidence</th></tr></thead>';
        html += '<tbody>';
        
        data.columns.forEach(col => {
            const current_col = this.report_data.columns.find(c => c.name === col.name);
            const current_type = current_col ? this.report_data.data_types[current_col.data_type_id]?.name : 'unknown';
            
            html += '<tr>';
            html += `<td>${col.name}</td>`;
            html += `<td>${current_type}</td>`;
            html += `<td>${col.detected_type}</td>`;
            html += `<td><span class="badge bg-${col.confidence === 'high' ? 'success' : 'warning'}">${col.confidence}</span></td>`;
            html += '</tr>';
        });
        
        html += '</tbody></table>';
        html += `<p class="text-muted">Detection method: ${data.detection_method}, Sample size: ${data.sample_size}</p>`;
        html += '</div></div></div></div>';
        
        // Add modal to body and show it
        $('body').append(html);
        const modal = new bootstrap.Modal(document.getElementById('typeDetectionModal'));
        modal.show();
        
        // Remove modal after hidden
        $('#typeDetectionModal').on('hidden.bs.modal', function() {
            $(this).remove();
        });
    }

    async detect_variables() {
        const query = this.query_editor.getValue();

        try {
            const result = await this.api_request(this.urls.detect_variables, {
                body: { query: query }
            });

            if (result.success && result.data.variables) {
                const variables = result.data.variables;

                this.report_data.variables = variables.map((var_name, idx) => ({
                    name: var_name,
                    display_name: var_name.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
                    variable_type_id: this.get_default_variable_type('text'),
                    data_type_id: this.get_default_data_type('string'),
                    order_index: idx,
                    is_required: true
                }));

                this.render_variables();

                if (variables.length > 0) {
                    this.show_success('#queryTestResult', `Found ${variables.length} variables`);
                    $('#variables-tab').tab('show');
                } else {
                    this.show_info('#queryTestResult', 'No variables found in query');
                }
            }
        } catch (error) {
            this.show_error('#queryTestResult', 'Failed to detect variables: ' + error.message);
        }
    }

    async test_connection() {
        const connection_id = $('#reportConnection').val();
        if (!connection_id) {
            this.show_error('#connectionTestResult', 'Please select a connection');
            return;
        }

        try {
            const result = await this.api_request(this.urls.test_connection, {
                body: {
                    connection_id: connection_id
                }
            });

            if (result.success && result.data.success) {
                this.show_success('#connectionTestResult', result.data.message);
            } else {
                this.show_error('#connectionTestResult', result.data?.message || 'Connection test failed');
            }
        } catch (error) {
            this.show_error('#connectionTestResult', 'Connection test failed: ' + error.message);
        }
    }

    format_query() {
        const query = this.query_editor.getValue();
        const formatted = query
            .replace(/SELECT/gi, 'SELECT')
            .replace(/FROM/gi, '\nFROM')
            .replace(/WHERE/gi, '\nWHERE')
            .replace(/GROUP BY/gi, '\nGROUP BY')
            .replace(/ORDER BY/gi, '\nORDER BY')
            .replace(/HAVING/gi, '\nHAVING')
            .replace(/JOIN/gi, '\nJOIN')
            .replace(/LEFT JOIN/gi, '\nLEFT JOIN')
            .replace(/RIGHT JOIN/gi, '\nRIGHT JOIN')
            .replace(/INNER JOIN/gi, '\nINNER JOIN');

        this.query_editor.setValue(formatted);
    }

    // Column Management (mostly unchanged, with minor enhancements)
    render_columns() {
        const container = $('#columnsList');
        container.empty();

        // Add analysis results area if not exists
        if (!$('#columnsTabAlerts').length) {
            container.before('<div id="columnsTabAlerts"></div>');
        }
        if (!$('#columnAnalysisResults').length) {
            container.before('<div id="columnAnalysisResults" style="display:none;"></div>');
        }

        if (this.report_data.columns.length === 0) {
            container.html(`
                <div class="text-muted">
                    No columns defined. 
                    <button class="btn btn-sm btn-primary" onclick="$('#testQueryBtn').click()">
                        Test Query to Auto-Detect Columns
                    </button>
                </div>
            `);
            return;
        }

        // Add column management buttons
        container.before(`
            <div class="mb-3" id="columnManagementButtons">
                <button class="btn btn-sm btn-secondary" id="analyzeColumnsBtn">
                    <i class="fas fa-search"></i> Analyze Columns
                </button>
                <button class="btn btn-sm btn-warning" id="syncColumnsBtn">
                    <i class="fas fa-sync"></i> Sync with Query
                </button>
                <button class="btn btn-sm btn-info" id="autoDetectTypesBtn">
                    <i class="fas fa-magic"></i> Auto-Detect Types
                </button>
            </div>
        `);

        this.report_data.columns.forEach((col, idx) => {
            const html = this.create_column_html(col, idx);
            container.append(html);
        });

        // Make sortable if library is available
        if (typeof Sortable !== 'undefined') {
            new Sortable(container[0], {
                handle: '.drag-handle',
                animation: 150,
                onEnd: (evt) => {
                    this.reorder_columns(evt.oldIndex, evt.newIndex);
                }
            });
        }
    }

    create_column_html(col, idx) {
        const data_type_options = Object.values(this.report_data.data_types)
            .map(dt => `<option value="${dt.uuid}" ${col.data_type_id === dt.uuid ? 'selected' : ''}>${dt.display}</option>`)
            .join('');

        return `
            <div class="column-item card mb-2" data-index="${idx}">
                <div class="card-body">
                    <div class="row align-items-center">
                        <div class="col-auto">
                            <span class="drag-handle" style="cursor: move;">≡</span>
                        </div>
                        <div class="col-md-2">
                            <label class="form-label">Column Name</label>
                            <input type="text" class="form-control form-control-sm" value="${col.name}"
                                   data-field="name" data-index="${idx}" readonly>
                        </div>
                        <div class="col-md-2">
                            <label class="form-label">Display Name</label>
                            <input type="text" class="form-control form-control-sm" value="${col.display_name}"
                                   data-field="display_name" data-index="${idx}"
                                   placeholder="Display name">
                        </div>
                        <div class="col-md-2">
                            <label class="form-label">Data Type</label>
                            <select class="form-select form-select-sm" data-field="data_type_id" data-index="${idx}">
                                ${data_type_options}
                            </select>
                        </div>
                        <div class="col-md-2">
                            <label class="form-label">Alignment</label>
                            <select class="form-select form-select-sm" data-field="alignment" data-index="${idx}">
                                <option value="left" ${col.alignment === 'left' ? 'selected' : ''}>Left</option>
                                <option value="center" ${col.alignment === 'center' ? 'selected' : ''}>Center</option>
                                <option value="right" ${col.alignment === 'right' ? 'selected' : ''}>Right</option>
                            </select>
                        </div>
                        <div class="col-md-3">
                            <label class="form-label">Options</label>
                            <div>
                                <div class="form-check form-check-inline">
                                    <input class="form-check-input" type="checkbox" ${col.is_searchable ? 'checked' : ''}
                                           data-field="is_searchable" data-index="${idx}" id="search_${idx}">
                                    <label class="form-check-label" for="search_${idx}">Search</label>
                                </div>
                                <div class="form-check form-check-inline">
                                    <input class="form-check-input" type="checkbox" ${col.is_sortable ? 'checked' : ''}
                                           data-field="is_sortable" data-index="${idx}" id="sort_${idx}">
                                    <label class="form-check-label" for="sort_${idx}">Sort</label>
                                </div>
                                <div class="form-check form-check-inline">
                                    <input class="form-check-input" type="checkbox" ${col.is_visible ? 'checked' : ''}
                                           data-field="is_visible" data-index="${idx}" id="visible_${idx}">
                                    <label class="form-check-label" for="visible_${idx}">Visible</label>
                                </div>
                            </div>
                        </div>
                        <div class="col-auto">
                            <button class="btn btn-sm btn-danger remove-column-btn" data-index="${idx}">×</button>
                        </div>
                    </div>
                    <div class="row mt-2">
                        <div class="col-md-3">
                            <input type="text" class="form-control form-control-sm"
                                   placeholder="Format string (e.g., {:.2f} for currency)"
                                   value="${col.format_string || ''}"
                                   data-field="format_string" data-index="${idx}">
                        </div>
                        <div class="col-md-3">
                            <select class="form-select form-select-sm" data-field="search_type" data-index="${idx}">
                                <option value="contains" ${col.search_type === 'contains' ? 'selected' : ''}>Contains</option>
                                <option value="exact" ${col.search_type === 'exact' ? 'selected' : ''}>Exact Match</option>
                                <option value="range" ${col.search_type === 'range' ? 'selected' : ''}>Range</option>
                                <option value="date_range" ${col.search_type === 'date_range' ? 'selected' : ''}>Date Range</option>
                            </select>
                        </div>
                        <div class="col-md-3">
                            <input type="number" class="form-control form-control-sm"
                                   placeholder="Width (pixels)"
                                   value="${col.width || ''}"
                                   data-field="width" data-index="${idx}">
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    update_column(index, field, value) {
        if (field === 'is_searchable' || field === 'is_sortable' || field === 'is_visible') {
            value = value === 'true' || value === true;
        }
        this.report_data.columns[index][field] = value;
    }

    remove_column(index) {
        if (confirm('Remove this column?')) {
            this.report_data.columns.splice(index, 1);
            this.render_columns();
        }
    }

    add_column() {
        const name = prompt('Column name:');
        if (name) {
            this.report_data.columns.push({
                name: name,
                display_name: name.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
                data_type_id: this.get_default_data_type('string'),
                order_index: this.report_data.columns.length,
                is_searchable: true,
                is_visible: true,
                is_sortable: true,
                alignment: 'left',
                search_type: 'contains'
            });
            this.render_columns();
        }
    }

    reorder_columns(old_index, new_index) {
        const [moved_column] = this.report_data.columns.splice(old_index, 1);
        this.report_data.columns.splice(new_index, 0, moved_column);

        // Update order indices
        this.report_data.columns.forEach((col, idx) => {
            col.order_index = idx;
        });
    }

    // Variable Management (unchanged)
    render_variables() {
        const container = $('#variablesList');
        container.empty();

        if (this.report_data.variables.length === 0) {
            container.html('<div class="text-muted">No variables defined. Use :variable_name in your query.</div>');
            return;
        }

        this.report_data.variables.forEach((variable, idx) => {
            const html = this.create_variable_html(variable, idx);
            container.append(html);
        });
    }

    create_variable_html(variable, idx) {
        const variable_type_options = Object.values(this.report_data.variable_types)
            .map(vt => `<option value="${vt.uuid}" ${variable.variable_type_id === vt.uuid ? 'selected' : ''}>${vt.display}</option>`)
            .join('');

        const data_type_options = Object.values(this.report_data.data_types)
            .map(dt => `<option value="${dt.uuid}" ${variable.data_type_id === dt.uuid ? 'selected' : ''}>${dt.display}</option>`)
            .join('');

        return `
            <div class="variable-item card mb-3" data-index="${idx}">
                <div class="card-body">
                    <div class="row">
                        <div class="col-md-3">
                            <label class="form-label">Variable Name</label>
                            <input type="text" class="form-control" value="${variable.name}"
                                   data-field="name" data-index="${idx}" readonly>
                        </div>
                        <div class="col-md-3">
                            <label class="form-label">Display Name</label>
                            <input type="text" class="form-control" value="${variable.display_name}"
                                   data-field="display_name" data-index="${idx}">
                        </div>
                        <div class="col-md-3">
                            <label class="form-label">Input Type</label>
                            <select class="form-select" data-field="variable_type_id" data-index="${idx}">
                                ${variable_type_options}
                            </select>
                        </div>
                        <div class="col-md-3">
                            <label class="form-label">Data Type</label>
                            <select class="form-select" data-field="data_type_id" data-index="${idx}">
                                ${data_type_options}
                            </select>
                        </div>
                    </div>
                    <div class="row mt-2">
                        <div class="col-md-4">
                            <label class="form-label">Default Value</label>
                            <input type="text" class="form-control" value="${variable.default_value || ''}"
                                   data-field="default_value" data-index="${idx}">
                        </div>
                        <div class="col-md-4">
                            <label class="form-label">Placeholder</label>
                            <input type="text" class="form-control" value="${variable.placeholder || ''}"
                                   data-field="placeholder" data-index="${idx}">
                        </div>
                        <div class="col-md-4">
                            <label class="form-label">Options</label>
                            <div>
                                <div class="form-check form-check-inline">
                                    <input class="form-check-input" type="checkbox" ${variable.is_required ? 'checked' : ''}
                                           data-field="is_required" data-index="${idx}" id="req_${idx}">
                                    <label class="form-check-label" for="req_${idx}">Required</label>
                                </div>
                                <div class="form-check form-check-inline">
                                    <input class="form-check-input" type="checkbox" ${variable.is_hidden ? 'checked' : ''}
                                           data-field="is_hidden" data-index="${idx}" id="hidden_${idx}">
                                    <label class="form-check-label" for="hidden_${idx}">Hidden</label>
                                </div>
                                <button class="btn btn-sm btn-danger float-end remove-variable-btn" data-index="${idx}">Remove</button>
                            </div>
                        </div>
                    </div>
                    <div class="row mt-2">
                        <div class="col">
                            <label class="form-label">Help Text</label>
                            <input type="text" class="form-control" value="${variable.help_text || ''}"
                                   data-field="help_text" data-index="${idx}"
                                   placeholder="Help text for users">
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    update_variable(index, field, value) {
        if (field === 'is_required' || field === 'is_hidden') {
            value = value === 'true' || value === true;
        }
        this.report_data.variables[index][field] = value;
    }

    remove_variable(index) {
        if (confirm('Remove this variable?')) {
            this.report_data.variables.splice(index, 1);
            this.render_variables();
        }
    }

    add_variable() {
        const name = prompt('Variable name (without colon):');
        if (name) {
            this.report_data.variables.push({
                name: name,
                display_name: name.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
                variable_type_id: this.get_default_variable_type('text'),
                data_type_id: this.get_default_data_type('string'),
                order_index: this.report_data.variables.length,
                is_required: true
            });
            this.render_variables();
        }
    }

    // Preview (unchanged)
    prepare_preview() {
        // Build variable inputs
        const variable_inputs_html = this.report_data.variables
            .filter(v => !v.is_hidden)
            .map(v => {
                const var_type = this.report_data.variable_types[v.variable_type_id];
                let input_html = '';

                switch (var_type?.name) {
                    case 'date':
                        input_html = `<input type="date" class="form-control preview-variable"
                                           data-name="${v.name}"
                                           value="${v.default_value || ''}"
                                           ${v.is_required ? 'required' : ''}>`;
                        break;
                    case 'datetime':
                        input_html = `<input type="datetime-local" class="form-control preview-variable"
                                           data-name="${v.name}"
                                           value="${v.default_value || ''}"
                                           ${v.is_required ? 'required' : ''}>`;
                        break;
                    case 'number':
                        input_html = `<input type="number" class="form-control preview-variable"
                                           data-name="${v.name}"
                                           value="${v.default_value || ''}"
                                           ${v.is_required ? 'required' : ''}>`;
                        break;
                    case 'select':
                        // TODO: Handle select options
                        input_html = `<select class="form-control preview-variable"
                                            data-name="${v.name}"
                                            ${v.is_required ? 'required' : ''}>
                                        <option value="">Select...</option>
                                      </select>`;
                        break;
                    default:
                        input_html = `<input type="text" class="form-control preview-variable"
                                           data-name="${v.name}"
                                           value="${v.default_value || ''}"
                                           placeholder="${v.placeholder || ''}"
                                           ${v.is_required ? 'required' : ''}>`;
                }

                return `
                    <div class="mb-3">
                        <label class="form-label">${v.display_name}${v.is_required ? ' *' : ''}</label>
                        ${input_html}
                        ${v.help_text ? `<small class="text-muted">${v.help_text}</small>` : ''}
                    </div>
                `;
            }).join('');

        $('#variableInputs').html(variable_inputs_html || '<p class="text-muted">No variables required for this report.</p>');
    }

    async run_preview() {
        if (!this.is_edit_mode) {
            this.show_info('#previewResults', 'Save the report first to preview it');
            return;
        }

        // Collect variable values
        const vars = {};
        $('.preview-variable').each(function() {
            vars[$(this).data('name')] = $(this).val();
        });

        this.show_loading(true);

        try {
            const result = await this.api_request(this.urls.preview_report, {
                body: { 
                    report_id: this.report_id,
                    limit: 10,
                    vars: vars
                }
            });

            if (result.success && result.data) {
                this.display_preview_results(result.data);
            }
        } catch (error) {
            this.show_error('#previewResults', 'Preview failed: ' + error.message);
        } finally {
            this.show_loading(false);
        }
    }

    display_preview_results(data) {
        if (!data.data || data.data.length === 0) {
            $('#previewResults').html('<div class="alert alert-info">No results found</div>');
            return;
        }

        // Build table
        const headers = Object.keys(data.data[0]);
        const table_html = `
            <div class="table-responsive">
                <table class="table table-striped table-bordered">
                    <thead class="table-dark">
                        <tr>
                            ${headers.map(h => `<th>${h}</th>`).join('')}
                        </tr>
                    </thead>
                    <tbody>
                        ${data.data.map(row => `
                            <tr>
                                ${headers.map(h => `<td>${row[h] !== null ? row[h] : '<em class="text-muted">null</em>'}</td>`).join('')}
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
            <p class="text-muted mt-2">Showing ${data.data.length} of ${data.recordsTotal || data.data.length} total records</p>
        `;

        $('#previewResults').html(table_html);
    }

    // Save Operations (unchanged)
    async save_report(is_draft = false) {
        if (!this.validate_report()) return;

        this.show_loading(true);

        try {
            const report_data = this.get_report_data();
            if (is_draft) {
                report_data.is_active = false;
            }

            let result;

            if (this.is_edit_mode) {
                // Update existing report
                result = await this.api_request(this.urls.data_api, {
                    body: {
                        model: 'Report',
                        operation: 'update',
                        uuid: this.report_id,
                        data: report_data
                    }
                });
            } else {
                // Create new report
                result = await this.api_request(this.urls.data_api, {
                    body: {
                        model: 'Report',
                        operation: 'create',
                        data: report_data
                    }
                });
            }

            if (!result.success) {
                throw new Error(result.error || 'Failed to save report');
            }

            const report_uuid = this.is_edit_mode ? this.report_id : result.data.uuid;

            // Save columns and variables
            await this.save_columns(report_uuid);
            await this.save_variables(report_uuid);

            // Success!
            this.show_success(
                is_draft ? 'Draft saved successfully!' : 'Report saved successfully!'
            );

            // If it was a create, switch to edit mode
            if (!this.is_edit_mode) {
                this.report_id = report_uuid;
                this.is_edit_mode = true;
                window.history.replaceState({}, '', `/reports/builder/${report_uuid}`);
            }

            // Offer to view the report
            if (!is_draft) {
                setTimeout(() => {
                    if (confirm('Report saved! Would you like to view it now?')) {
                        window.location.href = `/reports/view/${report_uuid}`;
                    }
                }, 1000);
            }

        } catch (error) {
            this.show_error('Error saving report: ' + error.message);
        } finally {
            this.show_loading(false);
        }
    }

    save_draft() {
        this.save_report(true);
    }

    get_report_data() {
        const tags_value = $('#reportTags').val();
        const tags = tags_value ? tags_value.split(',').map(t => t.trim()).filter(t => t) : [];

        return {
            slug: $('#reportSlug').val(),
            name: $('#reportName').val(),
            display: $('#reportDisplay').val() || null,
            description: $('#reportDescription').val() || null,
            query: this.query_editor.getValue(),
            connection_id: $('#reportConnection').val(),
            category: $('#reportCategory').val() || null,
            tags: tags,
            report_template_id: $('#reportTemplate').val() || null,
            is_wide: $('#isWide').is(':checked'),
            is_ajax: $('#isAjax').is(':checked'),
            is_auto_run: $('#isAutoRun').is(':checked'),
            is_searchable: $('#isSearchable').is(':checked'),
            is_public: $('#isPublic').is(':checked'),
            is_download_csv: $('#isDownloadCsv').is(':checked'),
            is_download_xlsx: $('#isDownloadXlsx').is(':checked'),
            is_active: true,
            options: {
                results_limit: parseInt($('#resultsLimit').val()) || 0,
                cache_duration_minutes: parseInt($('#cacheMinutes').val()) || 60
            }
        };
    }

    async save_columns(report_uuid) {
        // Skip if no columns defined yet
        if (this.report_data.columns.length === 0) {
            console.log('No columns to save yet');
            return;
        }

        // Delete existing columns if editing
        if (this.is_edit_mode) {
            const existing_columns = await this.get_existing_columns(report_uuid);
            for (const col of existing_columns) {
                await this.api_request(this.urls.data_api, {
                    body: {
                        model: 'ReportColumn',
                        operation: 'delete',
                        uuid: col.uuid
                    }
                });
            }
        }

        // Add new columns
        for (const column of this.report_data.columns) {
            const col_result = await this.api_request(this.urls.data_api, {
                body: {
                    model: 'ReportColumn',
                    operation: 'create',
                    data: {
                        ...column,
                        report_id: report_uuid
                    }
                }
            });

            if (!col_result.success) {
                console.error('Failed to create column:', col_result.error);
            }
        }

        // Call reorder API only if we have columns and the API is available
        if (this.urls.reorder_columns && this.report_data.columns.length > 0) {
            const column_order = this.report_data.columns.map(col => col.name);
            try {
                await this.api_request(this.urls.reorder_columns, {
                    body: {
                        report_id: report_uuid,
                        column_order: column_order
                    }
                });
            } catch (error) {
                // Non-critical error - report is still saved
                console.warn('Failed to set column order:', error);
            }
        }
    }

    async save_variables(report_uuid) {
        // Skip if no variables defined yet
        if (this.report_data.variables.length === 0) {
            console.log('No variables to save yet');
            return;
        }

        // Delete existing variables if editing
        if (this.is_edit_mode) {
            const existing_variables = await this.get_existing_variables(report_uuid);
            for (const variable of existing_variables) {
                await this.api_request(this.urls.data_api, {
                    body: {
                        model: 'ReportVariable',
                        operation: 'delete',
                        uuid: variable.uuid
                    }
                });
            }
        }

        // Add new variables
        for (const variable of this.report_data.variables) {
            const var_result = await this.api_request(this.urls.data_api, {
                body: {
                    model: 'ReportVariable',
                    operation: 'create',
                    data: {
                        ...variable,
                        report_id: report_uuid
                    }
                }
            });

            if (!var_result.success) {
                console.error('Failed to create variable:', var_result.error);
            }
        }

        // Validate variables if API available and we have variables
        if (this.urls.validate_variables && this.report_data.variables.length > 0) {
            try {
                await this.api_request(this.urls.validate_variables, {
                    body: {
                        report_id: report_uuid
                    }
                });
            } catch (error) {
                // Non-critical error
                console.warn('Failed to validate variables:', error);
            }
        }
    }

    async get_existing_columns(report_uuid) {
        const result = await this.api_request(this.urls.data_api, {
            body: {
                model: 'ReportColumn',
                operation: 'list',
                filters: { report_id: report_uuid }
            }
        });
        return result.success ? result.data : [];
    }

    async get_existing_variables(report_uuid) {
        const result = await this.api_request(this.urls.data_api, {
            body: {
                model: 'ReportVariable',
                operation: 'list',
                filters: { report_id: report_uuid }
            }
        });
        return result.success ? result.data : [];
    }

    validate_report() {
        const errors = [];

        if (!$('#reportName').val()) errors.push('Report name is required');
        if (!$('#reportSlug').val()) errors.push('Report slug is required');
        if (!$('#reportConnection').val()) errors.push('Database connection is required');
        if (!this.query_editor.getValue()) errors.push('SQL query is required');

        // Validate slug format
        const slug = $('#reportSlug').val();
        if (slug && !/^[a-z0-9-]+$/.test(slug)) {
            errors.push('Slug can only contain lowercase letters, numbers, and hyphens');
        }

        if (errors.length > 0) {
            alert('Please fix the following errors:\n\n' + errors.join('\n'));
            return false;
        }

        return true;
    }

    // Helper Methods (unchanged)
    get_default_data_type(sql_type) {
        const type_map = {
            'VARCHAR': 'string',
            'TEXT': 'string',
            'CHAR': 'string',
            'INT': 'integer',
            'INTEGER': 'integer',
            'BIGINT': 'integer',
            'SMALLINT': 'integer',
            'DECIMAL': 'decimal',
            'NUMERIC': 'decimal',
            'FLOAT': 'decimal',
            'DOUBLE': 'decimal',
            'REAL': 'decimal',
            'DATE': 'date',
            'DATETIME': 'datetime',
            'TIMESTAMP': 'datetime',
            'TIME': 'time',
            'BOOLEAN': 'boolean',
            'BOOL': 'boolean'
        };

        const upper_type = (sql_type || '').toUpperCase();
        for (const [key, value] of Object.entries(type_map)) {
            if (upper_type.includes(key)) {
                const data_type = Object.values(this.report_data.data_types).find(dt => dt.name === value);
                return data_type ? data_type.uuid : null;
            }
        }

        // Default to string
        const string_type = Object.values(this.report_data.data_types).find(dt => dt.name === 'string');
        return string_type ? string_type.uuid : null;
    }

    get_default_variable_type(type) {
        const var_type = Object.values(this.report_data.variable_types).find(vt => vt.name === type);
        return var_type ? var_type.uuid : null;
    }

    // UI Helper Methods (unchanged)
    show_loading(show) {
        if (show) {
            $('#loadingOverlay').show();
        } else {
            $('#loadingOverlay').hide();
        }
    }

    show_error(message, selector = null) {
        const html = `<div class="alert alert-danger alert-dismissible fade show" role="alert">
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        </div>`;

        if (selector) {
            $(selector).html(html);
        } else {
            // Show as toast
            this.show_toast(message, 'danger');
        }
    }

    show_success(message, selector = null) {
        const html = `<div class="alert alert-success alert-dismissible fade show" role="alert">
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        </div>`;

        if (selector) {
            $(selector).html(html);
        } else {
            // Show as toast
            this.show_toast(message, 'success');
        }
    }

    show_info(selector, message) {
        $(selector).html(`<div class="alert alert-info alert-dismissible fade show" role="alert">
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        </div>`);
    }

    show_toast(message, type = 'info') {
        // Create toast container if it doesn't exist
        if (!$('#toastContainer').length) {
            $('body').append('<div id="toastContainer" class="toast-container position-fixed top-0 end-0 p-3"></div>');
        }

        const toast_id = 'toast_' + Date.now();
        const toast_html = `
            <div id="${toast_id}" class="toast align-items-center text-white bg-${type}" role="alert">
                <div class="d-flex">
                    <div class="toast-body">${message}</div>
                    <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
                </div>
            </div>
        `;

        $('#toastContainer').append(toast_html);
        const toast_el = document.getElementById(toast_id);
        const toast = new bootstrap.Toast(toast_el);
        toast.show();

        // Remove after hidden
        toast_el.addEventListener('hidden.bs.toast', () => {
            toast_el.remove();
        });
    }
}

// Event delegation for dynamically created elements
$(document).on('change', '.column-item input, .column-item select', function() {
    const field = $(this).data('field');
    const index = $(this).data('index');
    const value = $(this).is(':checkbox') ? $(this).is(':checked') : $(this).val();

    if (window.reportBuilder) {
        window.reportBuilder.update_column(index, field, value);
    }
});

$(document).on('click', '.remove-column-btn', function() {
    const index = $(this).data('index');
    if (window.reportBuilder) {
        window.reportBuilder.remove_column(index);
    }
});

$(document).on('change', '.variable-item input, .variable-item select', function() {
    const field = $(this).data('field');
    const index = $(this).data('index');
    const value = $(this).is(':checkbox') ? $(this).is(':checked') : $(this).val();

    if (window.reportBuilder) {
        window.reportBuilder.update_variable(index, field, value);
    }
});

$(document).on('click', '.remove-variable-btn', function() {
    const index = $(this).data('index');
    if (window.reportBuilder) {
        window.reportBuilder.remove_variable(index);
    }
});

// Delegate new metadata button clicks
$(document).on('click', '#analyzeColumnsBtn', function() {
    if (window.reportBuilder) {
        window.reportBuilder.analyze_columns_from_query();
    }
});

$(document).on('click', '#syncColumnsBtn', function() {
    if (window.reportBuilder) {
        window.reportBuilder.sync_columns_from_query();
    }
});

$(document).on('click', '#autoDetectTypesBtn', function() {
    if (window.reportBuilder) {
        window.reportBuilder.auto_detect_column_types();
    }
});