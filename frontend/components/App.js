import Flight from "./Flight";
import Ticket from "./Ticket";
import AppModel from "../model/AppModel";

export default class App {
    #flights = [];

    clearInputs = (ids) => {
        let input;
        for (let id of ids) {
            input = document.getElementById(id);
            input.value = '';
        }
    }

    readInputs = (ids, keys) => {
        let input
        let inputs = new Map();
        let i = 0;

        for (let id of ids) {
            input = document.getElementById(id);
            if (input.value) {
                inputs.set(keys[i], input.value);
            }
            i++;
        }
        return inputs;
    }

    addNewFlight = async ({
            flightID,
            fullName
        }) => {
        try {
            const addFlightResult = await AppModel.addReader({
                readerID: flightID,
                fullName
            });

            const newFlight = new Flight({
                flightID,
                fullName
            });
            this.#flights.push(newFlight);
            this.render();

            const optionElem = document.createElement('option');
            optionElem.setAttribute("value", flightID);
            optionElem.setAttribute("id", flightID);
            optionElem.innerHTML = fullName;
            document.getElementById('modal-move-ticket-input-airplane_id').appendChild(optionElem);

            this.addNotification({ text: addFlightResult.message, type: 'success' });
            console.log(addFlightResult);
        } catch (err) {
            this.addNotification({ text: err.message, type: 'error' });
            console.error(err);
        }
    }

    editFlight = async ({
            flightID,
            fullName
        }) => {
        try {
            const editFlightResult = await AppModel.editReader({
                readerID: flightID,
                fullName
            });

            const flightObject = this.#flights.find((flight) => flight.flightID === flightID);

            flightObject.fullName = fullName;

            this.render();

            const optionElem = document.getElementById(flightID);
            optionElem.innerHTML = fullName;

            this.addNotification({ text: editFlightResult.message, type: 'success' });
            console.log(editFlightResult);
        } catch (err) {
            this.addNotification({ text: err.message, type: 'error' });
            console.error(err);
        }
    }

    deleteFlight = async ({ flightID }) => {
        try {
            const deleteFlightResult = await AppModel.deleteReader({ readerID: flightID });

            this.#flights = this.#flights.filter((flight) => flight.flightID !== flightID);

            this.render();

            const optionElem = document.getElementById(flightID);
            document.getElementById('modal-move-ticket-input-airplane_id').removeChild(optionElem);

            this.addNotification({ text: deleteFlightResult.message, type: 'success' });
            console.log(deleteFlightResult);
        } catch (err) {
            this.addNotification({ text: err.message, type: 'error' });
            console.error(err);
        }

    }

    addNewTicket = async ({
            ticketID,
            fullName,
            title,
            amount
        }) => {

        try {
            const addTicketResult = await AppModel.addBook({
                bookID: ticketID,
                author: fullName,
                title,
                amount,
            });

            const optionElem = document.createElement('option');
            optionElem.setAttribute("value", ticketID);
            optionElem.setAttribute("id", ticketID);
            optionElem.setAttribute("author", fullName);
            optionElem.setAttribute("title", title);
            optionElem.innerHTML = fullName + ' - ' + title;
            document.getElementById('modal-add-ticket-input-airplane_id').appendChild(optionElem);

            const optionElem2 = document.createElement('option');
            optionElem2.setAttribute("value", ticketID);
            optionElem2.innerHTML = fullName + ' - ' + title;
            document.getElementById('modal-edit-ticket-input-airplane_id').appendChild(optionElem2);

            this.addNotification({ text: addTicketResult.message, type: 'success' });
            console.log(addTicketResult);
        } catch (err) {
            this.addNotification({ text: err.message, type: 'error' });
            console.error(err);
        }
    }

    editTicket = async ({
            ticketID,
            fullName,
            title,
            amount
        }) => {

        try {
            const editTicketResult = await AppModel.editBook({
                bookID: ticketID,
                author: fullName,
                title,
                amount
            });

            const optionElem = document.getElementById(ticketID);
            optionElem.innerHTML = fullName + ' - ' + title;

            this.addNotification({ text: editTicketResult.message, type: 'success' });
            console.log(editTicketResult);
        } catch (err) {
            this.addNotification({ text: err.message, type: 'error' });
            console.error(err);
        }
    }

    deleteTicket = async ({
        flightID,
        ticketID,
    }) => {

        try {
            const deleteTicketResult = await AppModel.removeBookFromReader({
                readerID: flightID,
                removedBookID: ticketID
            });

            const flightObject = this.#flights.find((flight) => flight.flightID === flightID);

            flightObject.popTicket(ticketID);

            this.render();

            this.addNotification({ text: deleteTicketResult.message, type: 'success' });
            console.log(deleteTicketResult);
        } catch (err) {
            this.addNotification({ text: err.message, type: 'error' });
            console.error(err);
        }
    }

    moveTicket = async ({
        srcFlightID,
        ticketID,
        destFlightID
    }) => {

        try {
            const moveTicketResult = await AppModel.moveBook({
                bookID: ticketID,
                srcReaderID: srcFlightID,
                destReaderID: destFlightID
            });

            const srcFlightObject = this.#flights.find((flight) => flight.flightID === srcFlightID);
            const ticketObject = srcFlightObject.tickets.find((ticket) => ticket.ticketID === ticketID);
            const destFlightObject = this.#flights.find((flight) => flight.flightID === destFlightID);

            srcFlightObject.popTicket(ticketID);
            ticketObject.flightID = destFlightID;
            destFlightObject.appendNewTicket(ticketObject);

            this.render();

            this.addNotification({ text: moveTicketResult.message, type: 'success' });
            console.log(moveTicketResult);
        } catch (err) {
            this.addNotification({ text: err.message, type: 'error' });
            console.error(err);
        }
    }

    addTicketToFlight = async ({
            ticketID,
            flightID
        }) => {

        try {
            const moveTicketResult = await AppModel.addBookToReader({
                readerID: flightID,
                addedBookID: ticketID
            });

            const fullName = document.getElementById(ticketID).getAttribute('author');
            const title = document.getElementById(ticketID).getAttribute('title');

            const newTicket = new Ticket({
                ticketID,
                fullName,
                title,
                flightID
            });

            this.#flights.find((flight) => flight.flightID === flightID).appendNewTicket(newTicket);

            this.render();

            this.addNotification({ text: moveTicketResult.message, type: 'success' });
            console.log(moveTicketResult);
        } catch (err) {
            this.addNotification({ text: err.message, type: 'error' });
            console.error(err);
        }
    }

    render() {
        document.querySelector('.flights-list').remove();

        const ulElement = document.createElement('ul');
        ulElement.classList.add('flights-list', 'row', 'row-cols-4');

        const liElement = document.createElement('li');
        liElement.classList.add('col', 'flights-adder-li');

        const buttonElement = document.createElement('button');
        buttonElement.classList.add('reader-adder', 'flights-adder', 'btn', 'btn-outline-primary');
        buttonElement.setAttribute('type', 'button');
        buttonElement.innerHTML = '&#10010; Добавить читателя';
        buttonElement.addEventListener('click', () => { document.getElementById('modal-add-flight').showModal(); })

        const buttonElement1 = document.createElement('button');
        buttonElement1.classList.add('book-adder', 'flights-adder', 'btn', 'btn-outline-info');
        buttonElement1.setAttribute('type', 'button');
        buttonElement1.innerHTML = '&#10010; Добавить книгу';
        buttonElement1.addEventListener('click', () => { document.getElementById('modal-add-book').showModal(); })

        const buttonElement2 = document.createElement('button');
        buttonElement2.classList.add('book-editer', 'flights-adder', 'btn', 'btn-outline-warning');
        buttonElement2.setAttribute('type', 'button');
        buttonElement2.innerHTML = '&#10000; Редактировать книгу';
        buttonElement2.addEventListener('click', () => { document.getElementById('modal-edit-ticket').showModal(); })

        liElement.appendChild(buttonElement);
        liElement.appendChild(buttonElement1);
        liElement.appendChild(buttonElement2);

        ulElement.appendChild(liElement);

        const mainElement = document.querySelector('.app-main');
        mainElement.appendChild(ulElement);

        for (let flight of this.#flights) {
            const flightElement = flight.render();
            const flightAdderElement = document.querySelector('.flights-adder-li');
            flightAdderElement.parentElement.insertBefore(flightElement, flightAdderElement);
        }
    }

    async init() {

        document.getElementById('modal-add-flight').querySelector('.modal-cancel-btn')
            .addEventListener('click', () => {
                const ids = [
                    'modal-add-flight-input-id',
                ];
                document.getElementById('modal-add-flight').close();
                this.clearInputs(ids);
            });
        document.getElementById('modal-edit-flight').querySelector('.modal-cancel-btn')
            .addEventListener('click', () => {
                const ids = [
                    'modal-edit-flight-input-destination',
                ];
                document.getElementById('modal-edit-flight').close();
                this.clearInputs(ids);
            });
        document.getElementById('modal-delete-flight').querySelector('.modal-cancel-btn')
            .addEventListener('click', () => {
                document.getElementById('modal-delete-flight').close();
            });
        // БИЛЕТЫ
        document.getElementById('modal-add-ticket').querySelector('.modal-cancel-btn')
            .addEventListener('click', () => {
                const ids = [
                    'modal-add-ticket-input-airplane_id'
                ];
                document.getElementById('modal-add-ticket').close();
                this.clearInputs(ids);
            });
        document.getElementById('modal-edit-ticket').querySelector('.modal-cancel-btn')
            .addEventListener('click', () => {
                const ids = [
                    'modal-edit-ticket-input-airplane_id',
                    'modal-edit-book-input-author',
                    'modal-edit-book-input-full_name',
                    'modal-edit-book-input-amount'
                ];
                document.getElementById('modal-edit-ticket').close();
                this.clearInputs(ids);
            });
        document.getElementById('modal-move-ticket').querySelector('.modal-cancel-btn')
            .addEventListener('click', () => {
                const ids = [
                    'modal-move-ticket-input-airplane_id',
                ];
                document.getElementById('modal-move-ticket').close();
                this.clearInputs(ids);
            });
        document.getElementById('modal-delete-ticket').querySelector('.modal-cancel-btn')
            .addEventListener('click', () => {
                document.getElementById('modal-delete-ticket').close();
            });
        document.getElementById('modal-add-book').querySelector('.modal-cancel-btn')
            .addEventListener('click', () => {
                const ids = [
                    'modal-add-book-input-author',
                    'modal-add-book-input-full_name',
                    'modal-add-book-input-amount'
                ];
                document.getElementById('modal-add-book').close();
                this.clearInputs(ids);
            });


        document.getElementById('modal-add-flight').querySelector('.modal-ok-btn')
            .addEventListener('click', () => {
                const ids = [
                    'modal-add-flight-input-id',
                ];
                const keys = [
                    'fullName'
                ];
                const inputs = this.readInputs(ids, keys);

                const {
                    fullName
                } = {
                    fullName: inputs.get(keys[0])
                };

                this.clearInputs(ids);
                document.getElementById('modal-add-flight').close();

                const flightID = crypto.randomUUID();

                this.addNewFlight({
                    flightID,
                    fullName
                });
            });
        document.getElementById('modal-edit-flight').querySelector('.modal-ok-btn')
            .addEventListener('click', (event) => {
                const flightID = event.target.getAttribute('flight_id');

                const ids = [
                    'modal-edit-flight-input-destination',
                ];
                const keys = [
                    'fullName',
                ];
                const inputs = this.readInputs(ids, keys);

                const {
                    fullName,
                } = {
                    fullName: inputs.get(keys[0])
                };

                this.clearInputs(ids);
                document.getElementById('modal-edit-flight').close();

                this.editFlight({
                    flightID,
                    fullName
                });
            });
        document.getElementById('modal-delete-flight').querySelector('.modal-ok-btn')
            .addEventListener('click', (event) => {
                const flightID = event.target.getAttribute('flight_id');

                document.getElementById('modal-delete-flight').close();

                this.deleteFlight({
                    flightID
                });
            });
        // БИЛЕТЫ
        document.getElementById('modal-add-book').querySelector('.modal-ok-btn')
            .addEventListener('click', () => {
                const ids = [
                    'modal-add-book-input-author',
                    'modal-add-book-input-full_name',
                    'modal-add-book-input-amount'
                ];
                const keys = [
                    'fullName',
                    'title',
                    'amount'
                ];
                const inputs = this.readInputs(ids, keys);

                const ticketID = crypto.randomUUID();

                const {
                    fullName,
                    title,
                    amount
                } = {
                    fullName: inputs.get(keys[0]),
                    title: inputs.get(keys[1]),
                    amount: inputs.get(keys[2])
                };

                this.clearInputs(ids);
                document.getElementById('modal-add-book').close();

                this.addNewTicket({
                    ticketID,
                    fullName,
                    title,
                    amount
                });
            });
        document.getElementById('modal-edit-ticket').querySelector('.modal-ok-btn')
            .addEventListener('click', () => {
                const ids = [
                    'modal-edit-ticket-input-airplane_id',
                    'modal-edit-book-input-author',
                    'modal-edit-book-input-full_name',
                    'modal-edit-book-input-amount'
                ];
                const keys = [
                    'ticketID',
                    'fullName',
                    'title',
                    'amount'
                ];
                const inputs = this.readInputs(ids, keys);

                const {
                    ticketID,
                    fullName,
                    title,
                    amount
                } = {
                    ticketID: inputs.get(keys[0]),
                    fullName: inputs.get(keys[1]),
                    title: inputs.get(keys[2]),
                    amount: inputs.get(keys[3])
                };

                this.clearInputs(ids);
                document.getElementById('modal-edit-ticket').close();

                this.editTicket({
                    ticketID,
                    fullName,
                    title,
                    amount
                });
            });

        document.getElementById('modal-add-ticket').querySelector('.modal-ok-btn')
            .addEventListener('click', (event) => {
                const flightID = event.target.getAttribute('flight_id');

                const ids = [
                    'modal-add-ticket-input-airplane_id',
                ];
                const keys = [
                    'ticketID',
                ];
                const inputs = this.readInputs(ids, keys);

                const {
                    ticketID
                } = {
                    ticketID: inputs.get(keys[0]),
                };

                this.clearInputs(ids);
                document.getElementById('modal-add-ticket').close();

                this.addTicketToFlight({
                    ticketID,
                    flightID
                });
            });
        document.getElementById('modal-delete-ticket').querySelector('.modal-ok-btn')
            .addEventListener('click', (event) => {
                const flightID = event.target.getAttribute('flight_id');
                const ticketID = event.target.getAttribute('ticket_id');

                document.getElementById('modal-delete-ticket').close();

                this.deleteTicket({
                    flightID,
                    ticketID
                });
            });
        document.getElementById('modal-move-ticket').querySelector('.modal-ok-btn')
            .addEventListener('click', (event) => {
                const srcFlightID = event.target.getAttribute('flight_id');
                const ticketID = event.target.getAttribute('ticket_id');

                const ids = [
                    'modal-move-ticket-input-airplane_id',
                ];
                const keys = [
                    'destFlightID',
                ];
                const inputs = this.readInputs(ids, keys);

                const {
                    destFlightID
                } = {
                    destFlightID: inputs.get(keys[0]),
                };

                this.clearInputs(ids);
                document.getElementById('modal-move-ticket').close();

                this.moveTicket({
                    srcFlightID,
                    ticketID,
                    destFlightID
                });
            });


        try {
            const {flights, airplanes} = await AppModel.getReaders();

            // Перенос серверной модели данных на клиент
            for (const flight of flights) {
                const flightObject = new Flight({
                    flightID: flight.readerID,
                    fullName: flight.fullName
                })

                for (const ticket of flight.books) {
                    const ticketObject = new Ticket({
                        ticketID: ticket.bookID,
                        fullName: ticket.author,
                        title: ticket.title,
                        flightID: flight.readerID
                    })

                    flightObject.appendNewTicket(ticketObject);
                }

                const optionElem = document.createElement('option');
                optionElem.setAttribute("value", flight.readerID);
                optionElem.setAttribute("id", flight.readerID);
                optionElem.innerHTML = flight.fullName;
                document.getElementById('modal-move-ticket-input-airplane_id').appendChild(optionElem);

                this.#flights.push(flightObject);
            }

            for (const airplane of airplanes) {
                const optionElem1 = document.createElement('option');
                optionElem1.setAttribute("value", airplane.bookID);
                optionElem1.setAttribute("id", airplane.bookID);
                optionElem1.setAttribute("author", airplane.author);
                optionElem1.setAttribute("title", airplane.title);
                optionElem1.innerHTML = airplane.author + ' - ' + airplane.title;
                document.getElementById('modal-add-ticket-input-airplane_id').appendChild(optionElem1);

                const optionElem2 = document.createElement('option');
                optionElem2.setAttribute("value", airplane.bookID);
                optionElem2.innerHTML = airplane.author + ' - ' + airplane.title;
                document.getElementById('modal-edit-ticket-input-airplane_id').appendChild(optionElem2);
            }

            this.render();
        } catch(err) {
            this.addNotification({ text: err.message, type: 'error' });
        }
    }

    addNotification = ({ text, type }) => {
        const notifications = document.getElementById('app-notifications');

        const notificationID = crypto.randomUUID();
        const notification = document.createElement('div');
        notification.classList.add(
            'notification',
            type === 'success' ? 'notification-success' : 'notification-error'
        );
        notification.setAttribute('id', notificationID);
        notification.innerHTML = text;

        notifications.appendChild(notification);

        notifications.show();

        setTimeout(() => {document.getElementById(notificationID).remove();}, 5000);
    }
};
