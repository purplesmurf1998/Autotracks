describe('User Log in Test', () => {
    it('Visits the login page and loging a user in successfully', () => {
      //Visiting the login page
      cy.visit('/#/pages/login')
      cy.contains('Login');
      //Filling out the necessary fields to log a user in
      cy.get("[placeholder='Email']")
      .type('john.appleseed@netscape.net')
      .should('have.value', 'john.appleseed@netscape.net')

      cy.get("[placeholder='Password']")
      .type('password123')
      .should('have.value', 'password123')

      cy.get("button.btn.px-4.btn-primary")
      .click()
      //Ensuring that a user was redirected to the dashboard upon a successful login
      cy.url().should('include', '#/dashboard')
      //Ensuring that the authorization token exists upon a successful login
      cy.getLocalStorage('autotracksAuthToken').should('exist')
    })
  })