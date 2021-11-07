describe('User Logout Test', () => {
    it('Visits the dashboard page and loging a user out successfully', () => {
      cy.setLocalStorage('autotracksAuthToken', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2MTg3MWU2NmFjMzNjYmE1N2JmMWQ4MTEiLCJpYXQiOjE2MzYzMTYwMTAsImV4cCI6MTYzODkwODAxMH0.rXnYhgWxnX3koe04r0MV_iASdQ_qPW01wnYnNwZ3QAg')
      cy.visit('/#/dashboard')
      cy.get("#nav-dropdown")
      .click()

      cy.get("#log-out")
      .click()

      cy.url().should('include', '/#/pages/login')
        
    })
  })