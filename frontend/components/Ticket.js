export default class Ticket {
    #ticketID
    #fullName;
    #title;
    #flightID;

        constructor({
            ticketID,
            fullName,
            title,
            flightID
        }) {
            this.#ticketID = ticketID
            this.#fullName = fullName;
            this.#title = title;
            this.#flightID = flightID;
    }

    get ticketID() { return this.#ticketID; }

    set fullName(value) { this.#fullName = value; }

    set title(value) { this.#title = value; }

    set flightID(value) { this.#flightID = value; }

    render() {
        const liElement = document.createElement('li');
        liElement.classList.add('flight__tickets-list-item', 'ticket', 'row');
        liElement.setAttribute('ticketID', this.#ticketID);

        const divElement1 = document.createElement('div');
        divElement1.classList.add('ticket-info', 'row');

        const spanElement1 = document.createElement('span');
        spanElement1.classList.add('ticket__id', 'col-12', 'align-self-end');
        spanElement1.innerHTML = this.#fullName;
        divElement1.appendChild(spanElement1);

        const spanElement2 = document.createElement('span');
        spanElement2.classList.add('ticket__full_name', 'col-12', 'align-self-end');
        spanElement2.innerHTML = this.#title;
        divElement1.appendChild(spanElement2);

        liElement.appendChild(divElement1);

        const divElement2 = document.createElement('div');
        divElement2.classList.add('row', 'justify-content-center');

        const buttonElement2 = document.createElement('button');
        buttonElement2.classList.add('ticket__move-btn', 'btn', 'btn-outline-info', 'col-2');
        buttonElement2.setAttribute('type', 'button');
        buttonElement2.addEventListener('click', () => {
            const button = document.getElementById('modal-move-ticket').querySelector('.modal-ok-btn');
            button.setAttribute('flight_id', this.#flightID);
            button.setAttribute('ticket_id', this.#ticketID);
            document.getElementById('modal-move-ticket').showModal();
        });
        buttonElement2.innerHTML = '&#8617;';
        divElement2.appendChild(buttonElement2);

        const buttonElement3 = document.createElement('button');
        buttonElement3.classList.add('ticket__delete-btn', 'btn', 'btn-outline-danger', 'col-2');
        buttonElement3.setAttribute('type', 'button');
        buttonElement3.addEventListener('click', () => {
            const button = document.getElementById('modal-delete-ticket').querySelector('.modal-ok-btn');
            button.setAttribute('flight_id', this.#flightID);
            button.setAttribute('ticket_id', this.#ticketID);
            document.getElementById('modal-delete-ticket').showModal();
        });
        buttonElement3.innerHTML = '&#10008;';
        divElement2.appendChild(buttonElement3);

        liElement.appendChild(divElement2);

        return liElement;
    }
};
