Cypress.on('uncaught:exception', (err, runnable) => {
  // Ne pas échouer le test pour les erreurs non capturées
  return false;
});

