describe('User Logout Test', () => {
    it('Visits the dashboard page and loging a user out successfully', () => {
      //Setting the token in the local storage to be able to access dashboard page
      cy.setLocalStorage('autotracksAuthToken', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2MTg3MWU2NmFjMzNjYmE1N2JmMWQ4MTEiLCJpYXQiOjE2MzYzMTYwMTAsImV4cCI6MTYzODkwODAxMH0.rXnYhgWxnX3koe04r0MV_iASdQ_qPW01wnYnNwZ3QAg')
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