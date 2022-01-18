describe('User Logout Test', () => {
    it('Visits the dashboard page and loging a user out successfully', () => {
      //Setting the token in the local storage to be able to access dashboard page
      cy.setLocalStorage('autotracksAuthToken','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2MWE3YjlkMjUzMmU5MTk4YjI0ZjNhODgiLCJpYXQiOjE2NDI1MjYwNjIsImV4cCI6MTY0NTExODA2Mn0.VJ_fSlQS8wS4tjPSOGGmmTRk0RK3Jnkbu-m5lc-kLhE')
      cy.visit('/#/dashboard')
      cy.get("#nav-dropdown")
      .click()
      //Clicking on the log out button
      cy.get("#log-out")
      .click()
      //Validating that the user was redirected to the login page upon a successful logout
      cy.url().should('include', '/#/pages/login')
    })
  })
