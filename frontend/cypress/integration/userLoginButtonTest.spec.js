describe('User Log in Test', () => {
    it('Visits the login page and loging a user in successfully', () => {
      //Visiting the login page
      cy.visit('/#/pages/login')
      cy.contains('Login');
      //clicks the login button
      cy.get("button.btn.px-4.btn-primary")
      .click()

    })
  })
