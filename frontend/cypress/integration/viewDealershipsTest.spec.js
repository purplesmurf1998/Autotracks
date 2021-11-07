describe('View Dealerships Test', () => {
    it('Visits the dealerships page and view list of dealerships', () => {
      cy.setLocalStorage('autotracksAuthToken', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2MTg3MWU2NmFjMzNjYmE1N2JmMWQ4MTEiLCJpYXQiOjE2MzYzMTYwMTAsImV4cCI6MTYzODkwODAxMH0.rXnYhgWxnX3koe04r0MV_iASdQ_qPW01wnYnNwZ3QAg')
      cy.visit('/#/dashboard')

      cy.get("[href='#/dealerships']")
      .click()

      cy.contains("List of registered dealerships");
        
    })
  })