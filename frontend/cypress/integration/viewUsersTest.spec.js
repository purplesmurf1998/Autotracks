describe('View Users Test', () => {
    it('Visits the dealerships page and view list of staff members for a given dealership', () => {
        //Setting the token in the local storage to be able to access dealership page
        cy.setLocalStorage('autotracksAuthToken', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2MTg3MWU2NmFjMzNjYmE1N2JmMWQ4MTEiLCJpYXQiOjE2MzYzMTYwMTAsImV4cCI6MTYzODkwODAxMH0.rXnYhgWxnX3koe04r0MV_iASdQ_qPW01wnYnNwZ3QAg')
        //Visiting the dealership page
        cy.visit('/#/dealerships')
        //Clicking on a table row which represents a dealership
        cy.get("tr").eq(3)
        .click()

        //Checking if the selected dealership contains a list of staff accounts
        cy.contains("List of staff accounts")

        //Validating that a user ID exists for that given dealership
        cy.get("#618800e83c70133a04cea4ce").should('exist')
        .click()

        //Validating the existence of the email field for a given user
        cy.contains("abdul@gmail.com")     

    })
  })