describe('Create User Test', () => {
    it('Visits the dealerships page and creating a staff member for the selected dealership', () => {
        //Setting the token in the local storage to be able to access dealerships page
        cy.setLocalStorage('autotracksAuthToken', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2MTg3MWU2NmFjMzNjYmE1N2JmMWQ4MTEiLCJpYXQiOjE2MzYzMTYwMTAsImV4cCI6MTYzODkwODAxMH0.rXnYhgWxnX3koe04r0MV_iASdQ_qPW01wnYnNwZ3QAg')
        cy.visit('/#/dealerships')
        //Selecting a dealership for which a new staff member needs to be created
        cy.get("tr").eq(3)
        .click()
        cy.contains("List of staff accounts")
        cy.get("#create-staff-acc")
        .click()
        //Filling out the necesasry information to create a new staff member
        cy.get("[placeholder='User first name']")
        .type('test')
        .should('have.value', 'test')
        
        cy.get("[placeholder='User last name']")
        .type('test')
        .should('have.value', 'test')   
  
        cy.get("[placeholder='User email address']")
        .type('test_test@gmail.com')
        .should('have.value', 'test_test@gmail.com')
  
        cy.get("#role-select")
        .select("Management")

        cy.get("#create-staff")
        .click()

        cy.url().should('include', '#/dealerships')
        //Validating that a new staff member has been created and visible in the DOM
        cy.contains("test test")
    })
  })