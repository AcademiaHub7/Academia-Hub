export const paths = {
  components: {
    fichesPedagogiques: {
      root: '../../../fiches_pedagogiques',
      forms: {
        create: 'FicheCreateForm',
        edit: 'FicheEditForm',
        viewer: 'FicheViewer'
      },
      dashboard: 'FichePedagogiqueDashboard',
      list: 'FicheList',
      validation: 'FicheValidationWorkflow',
      analysis: 'FicheAnalysisDashboard',
      specialized: {
        elementsPlanification: 'ElementsPlanificationForm',
        deroulement: 'DeroulementBuilder',
        consigneResultat: 'ConsigneResultatEditor'
      },
      validationComponents: {
        workflow: 'ValidationWorkflow',
        corrections: 'CorrectionsEditor',
        recommandations: 'RecommandationsPanel',
        historique: 'HistoriqueEchanges',
        notifications: 'NotificationSystem',
        comparateur: 'ComparateurVersions'
      },
      export: {
        pdf: 'ExportPDFOfficial',
        preview: 'PrintPreview',
        bulk: 'ExportBulk',
        share: 'ShareFiche'
      }
    }
  }
};
