describe('LoginView', () => {
    beforeEach(() => {
      cy.visit(' https://jeuxweb.osc-fr1.scalingo.io/LoginView'); // Remplacez l'URL par celle correspondant à votre vue de connexion
    });
  
    it('should display the login form', () => {
      cy.get('[data-testid="login-form"]').should('exist');
      cy.get('[data-testid="username-input"]').should('exist');
      cy.get('[data-testid="password-input"]').should('exist');
    });
  
    it('should successfully log in', () => {
      const username = 'testuser';
      const password = 'testpassword';
  
      cy.get('[data-testid="username-input"]').type(username);
      cy.get('[data-testid="password-input"]').type(password);
      cy.get('[data-testid="login-button"]').click();
  
      // Assert the login success condition, for example, navigating to the Home view
      cy.url().should('include', '/home'); // Remplacez l'URL par celle correspondant à la vue Home après la connexion
      // Add additional assertions or checks as needed
    });
  
    it('should navigate to the registration page', () => {
      cy.get('[data-testid="register-button"]').click();
  
      // Assert the navigation to the registration page
      cy.url().should('include', '/register'); // Remplacez l'URL par celle correspondant à la vue d'enregistrement
      // Add additional assertions or checks as needed
    });
  });
  
  