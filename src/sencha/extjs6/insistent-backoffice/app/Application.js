/**
 * The main application class. An instance of this class is created by app.js when it
 * calls Ext.application(). This is the ideal place to handle application launch and
 * initialization details.
 */
Ext.define('InsistentBackoffice.Application', {
    extend: 'Ext.app.Application',
    reqiures: [
        'InsistentUtils.WorkflowHelper'
    ],
    
    name: 'InsistentBackoffice',

    stores: [
        // TODO: add global / shared stores here
    ],
    
    launch: function () {
        // TODO - Launch the application
        var x = Workflow.isEmpty(null);

        console.log('Packages works?', x);
    },

    onAppUpdate: function () {
        Ext.Msg.confirm('Application Update', 'This application has an update, reload?',
            function (choice) {
                if (choice === 'yes') {
                    window.location.reload();
                }
            }
        );
    }
});
