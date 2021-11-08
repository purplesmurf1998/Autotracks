describe('Edit User Test', () => {
    it('Visits the dealerships page and modifying user information for a given dealership', () => {
        //Setting the token in the local storage to be able to access dealerships page
        cy.setLocalStorage('autotracksAuthToken', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2MTg3MWU2NmFjMzNjYmE1N2JmMWQ4MTEiLCJpYXQiOjE2MzYzMTYwMTAsImV4cCI6MTYzODkwODAxMH0.rXnYhgWxnX3koe04r0MV_iASdQ_qPW01wnYnNwZ3QAg')
        cy.visit('/#/dealerships')
        //Selecting a dealership
        cy.get("tr").eq(3)
        .click()
        //Validating that the list of staff account is visible
        cy.contains("List of staff accounts")
        //Validating that the given user ID exists
        cy.get("#618800e83c70133a04cea4ce").should('exist')
        .click()

        cy.contains("abdul@gmail.com") 
        //Clicking on the edit user details button
        cy.get("#edit-user-acc")
        .click()
        //Modifying the user's first and last name
        cy.get("#first-name")
        .clear()
        .type("Cedrik")

        cy.get("#last-name")
        .clear()
        .type("Dubois")
        //Saving the changes
        cy.get("#save-user-changes")
        .click()

        cy.url().should('include', '#/dealerships')
        //Validating that the new first, last name have been updated and visible
        cy.contains("Cedrik Dubois")
    })
  })