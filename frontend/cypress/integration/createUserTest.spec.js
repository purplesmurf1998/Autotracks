describe('Create User Test', () => {
    it('Visits the dealerships page and creating a staff member for the selected dealership', () => {
      cy.setLocalStorage('autotracksAuthToken', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2MTg3MWU2NmFjMzNjYmE1N2JmMWQ4MTEiLCJpYXQiOjE2MzYzMTYwMTAsImV4cCI6MTYzODkwODAxMH0.rXnYhgWxnX3koe04r0MV_iASdQ_qPW01wnYnNwZ3QAg')
      cy.visit('/#/dealerships')
        cy.get("tr").eq(3)
        .click()

        cy.contains("List of staff accounts")

        cy.get("#create-staff-acc")
        .click()

        cy.get("[placeholder='User first name']")
        .type('test')
        .should('have.value', 'test')
        
        cy.get("[placeholder='User last name']")
        .type('test')
        .should('have.value', 'test')   
  
        cy.get("[placeholder='User email address']")
        .type('test@gmail.com')
        .should('have.value', 'test@gmail.com')
  
        cy.get("#role-select")
        .select("Management")

        cy.get("#create-staff")
        .click()

        cy.url().should('include', '#/dealerships')
        
        cy.contains("test test")
    })
  })