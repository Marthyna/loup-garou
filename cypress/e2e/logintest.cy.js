describe('LoginView Scenario', () => {
  beforeEach(() => {
    cy.visit('http://localhost:19006/'); // Remplacez l'URL par celle correspondant à votre vue de connexion
  });

  it('should successfully log in', () => {
    const username = 'a';
    const password = 'a';

    cy.get('[data-testid="username-input"]').type(username);
    cy.get('[data-testid="password-input"]').type(password);

    Cypress.on('uncaught:exception', () => {
      // Ignorer complètement les erreurs d'exception non capturées
      return false;
    });

    cy.get('[data-testid="id1"]').click();
  });
}); 