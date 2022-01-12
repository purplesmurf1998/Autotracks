describe('User Logout Test', () => {
    it('Visits the dashboard page and loging a user out successfully', () => {
      //Setting the token in the local storage to be able to access dashboard page
      cy.setLocalStorage('autotracksAuthToken', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2MThhYWNmNDVjZGM3NWI4Mjg4ZWI5YjUiLCJpYXQiOjE2MzgxMjkxMzAsImV4cCI6MTY0MDcyMTEzMH0.dJTD0ZWeL9Y6okiFwB4r5g7cbugVAmW6IU_BbKCGmIg')
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
