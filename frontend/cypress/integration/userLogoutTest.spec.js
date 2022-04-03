describe('User Logout Test', () => {
    it('Visits the dashboard page and loging a user out successfully', () => {
      //Setting the token in the local storage to be able to access dashboard page
      cy.setLocalStorage('autotracksAuthToken','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2MWE3YjlkMjUzMmU5MTk4YjI0ZjNhODgiLCJpYXQiOjE2NDg5NzYyNzgsImV4cCI6MTY1MTU2ODI3OH0.jr3dlo-sY2bjgYHiDRJ0xD6xImfaxeS9zxvMoUf-1d0')
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
