describe('Password field for Log in Test', () => {
    it('Visits the login page and checks if the password field can be typed in', () => {
      //Visiting the login page
      cy.visit('/#/pages/login')
      cy.contains('Login');
      //Filling out the email field and checking to see if it contains data
      cy.get("[placeholder='Password']")
      .type('password123')
      .should('have.value', 'password123')
    })
  })
