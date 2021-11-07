
describe('User Log in Test', () => {

    it('Visits the login page and loging a user in successfully', () => {
      cy.visit('/#/pages/login')
      cy.contains('Login');
      cy.get("[placeholder='Email']")
      .type('john.appleseed@netscape.net')
      .should('have.value', 'john.appleseed@netscape.net')

      cy.get("[placeholder='Password']")
      .type('password123')
      .should('have.value', 'password123')

      cy.get("button.btn.px-4.btn-primary")
      .click()

      cy.url().should('include', '#/dashboard')

      cy.getLocalStorage('autotracksAuthToken').should('exist')
 
    })
  })