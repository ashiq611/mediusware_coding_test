import React, { useState, useEffect } from "react";
import {
  Modal,
  Button,
  Form,
  FormControl,
  FormCheck,
  Table,
  Spinner,
} from "react-bootstrap";




const Problem2 = () => {
  const [showAllContacts, setShowAllContacts] = useState(false);
  const [showUSContacts, setShowUSContacts] = useState(false);
  const [modalACheckbox, setModalACheckbox] = useState(false);
  const [modalBCheckbox, setModalBCheckbox] = useState(false);
  const [contactsA, setContactsA] = useState([]);
  const [contactsB, setContactsB] = useState([]);
  const [searchTermA, setSearchTermA] = useState("");
  const [searchTermB, setSearchTermB] = useState("");
  const [pageA, setPageA] = useState(1);
  const [pageB, setPageB] = useState(1);
  const [showModalA, setShowModalA] = useState(false);
  const [showModalB, setShowModalB] = useState(false);
  const [showModalC, setShowModalC] = useState(false);
  const [selectedContact, setSelectedContact] = useState(null);

  const [contacts, setContacts] = useState([]);
  const [usContacts, setUsContacts] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetch("https://contact.mediusware.com/api/contacts/")
      .then((response) => response.json())
      .then((json) => {
        setContacts(json.results);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    setLoading(true);
    fetch(
      "https://contact.mediusware.com/api/country-contacts/United%20States/"
    )
      .then((response) => response.json())
      .then((json) => {
        setUsContacts(json.results);
        setLoading(false);
      });
  }, []);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         setLoading(true);
//         const [page1Response, page2Response] = await Promise.all([
//           fetch(
//             "https://contact.mediusware.com/api/country-contacts/United%20States/"
//           ),
//           fetch(
//             "https://contact.mediusware.com/api/country-contacts/United%20States/?page=2"
//           ),
//         ]);

//         const [page1Data, page2Data] = await Promise.all([
//           page1Response.json(),
//           page2Response.json(),
//         ]);

//         // Combine the results from both pages
//         const combinedData = {
//           results: [...page1Data.results, ...page2Data.results],
//         };

//         setUsContacts(combinedData);
//         setLoading(false);
//       } catch (error) {
//         console.error("Error fetching data", error);
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, []);

  const fetchContacts = async (country, page) => {
    try {
      setLoading(true);
      const response = await fetch(
        `${API_BASE_URL}${
          country ? `country-contacts/${country}/` : "contacts/"
        }?page=${page}`
      );

      if (!response.ok) {
        throw new Error(`Error fetching contacts: ${response.statusText}`);
      }

      const data = await response.json();
      setLoading(false);
      return data.results;
    } catch (error) {
      console.error("Error fetching contacts", error);
      setLoading(false);
      return [];
    }
  };

  useEffect(() => {
    const fetchContactsA = async () => {
      const data = await fetchContacts(null, pageA);
      setContactsA([...contactsA, ...data]);
    };

    const fetchContactsB = async () => {
      const data = await fetchContacts("us", pageB);
      setContactsB([...contactsB, ...data]);
    };

    if (showAllContacts) {
      fetchContactsA();
    }

    if (showUSContacts) {
      fetchContactsB();
    }
  }, [showAllContacts, showUSContacts, pageA, pageB]);

  const handleModalAClose = () => {
    setShowAllContacts(false);
    setModalACheckbox(false);
    setContactsA([]);
    setPageA(1);
  };

  const handleModalBClose = () => {
    setShowUSContacts(false);
    setModalBCheckbox(false);
    setContactsB([]);
    setPageB(1);
  };

  const handleContactClick = (contact) => {
    setSelectedContact(contact);
    setShowModalC(true);
  };

  const handleScrollA = () => {
    setPageA(pageA + 1);
  };

  const handleScrollB = () => {
    setPageB(pageB + 1);
  };

  const handleSearch = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `https://contact.mediusware.com/api/contacts/?search=${searchTermA}`
      );
      const data = await response.json();
      setContactsA(data.results);
      setLoading(false);
      setContacts([])
    } catch (error) {
      console.error("Error searching contacts", error);
      setLoading(false);
    }
  };

  const handleSearchB = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `https://contact.mediusware.com/api/country-contacts/United%20States/?search=${searchTermB}`
      );
      const data = await response.json();
      setContactsB(data.results);
      setLoading(false);
    } catch (error) {
      console.error("Error searching US contacts", error);
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="row justify-content-center mt-5">
        <h4 className="text-center text-uppercase mb-5">Problem-2</h4>
        <div className="d-flex justify-content-center gap-3">
          <button
            className="btn btn-lg btn-outline-primary"
            type="button"
            onClick={() => {
              setShowModalA(true);
              window.history.pushState({}, null, "/all-contacts");
            }}
          >
            All Contacts
          </button>
          <button
            className="btn btn-lg btn-outline-warning"
            type="button"
            onClick={() => {
              setShowModalB(true);
              window.history.pushState({}, null, "/us-contacts");
            }}
          >
            US Contacts
          </button>
        </div>
      </div>
      {/* Modal A */}
      <Modal show={showModalA} onHide={handleModalAClose}>
        <Modal.Header closeButton>
          <Modal.Title style={{ color: "#46139f" }}>All Contacts</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <FormControl
              type="text"
              placeholder="Search..."
              value={searchTermA}
              onChange={(e) => setSearchTermA(e.target.value)}
            />
            <Button
              variant="primary"
              onClick={handleSearch}
              className="mt-3"
              style={{ background: "#46139f", color: "white" }}
            >
              Search
            </Button>
          </Form>
          {loading && <Spinner animation="border" />}
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>ID</th>
                <th>Phone</th>
                <th>Country</th>
              </tr>
            </thead>
            <tbody>
              {contactsA
                .filter((contact) =>
                  modalACheckbox ? contact.id % 2 === 0 : true
                )
                .map((contact) => (
                  //   <div
                  //     key={contact.id}
                  //     onClick={() => handleContactClick(contact)}
                  //   >
                  //     {contact.phone} - {contact.country.name}
                  //   </div>
                  <tr
                    key={contact.id}
                    onClick={() => handleContactClick(contact)}
                  >
                    <td>{contact.id}</td>
                    <td>{contact.phone}</td>
                    <td>{contact.country.name}</td>
                  </tr>
                ))}
            </tbody>
          </Table>
          {contacts && (
            <Table striped bordered hover responsive>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Phone</th>
                  <th>Country</th>
                </tr>
              </thead>
              <tbody>
                {contacts.map((c) => (
                  <tr key={c.id} onClick={() => handleContactClick(c)}>
                    <td>{c.id}</td>
                    <td>{c.phone}</td>
                    <td>{c.country.name}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
          <Button
            variant="secondary"
            onClick={() => setShowModalA(false)}
            className="mt-3"
            style={{ background: "#46139f", color: "white" }}
          >
            Close
          </Button>
        </Modal.Body>
        <Modal.Footer>
          <FormCheck
            label="Only even"
            checked={modalACheckbox}
            onChange={() => setModalACheckbox(!modalACheckbox)}
          />
        </Modal.Footer>
      </Modal>

      {/* Modal B */}
      <Modal show={showModalB} onHide={handleModalBClose}>
        <Modal.Header closeButton>
          <Modal.Title style={{ color: "#ff7f50" }}>US Contacts</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <FormControl
              type="text"
              placeholder="Search..."
              value={searchTermB}
              onChange={(e) => setSearchTermB(e.target.value)}
            />
            <Button
              variant="primary"
              onClick={handleSearch}
              className="mt-3"
              style={{ background: "#46139f", color: "white" }}
            >
              Search
            </Button>
          </Form>
          {loading && <Spinner animation="border" />}
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>ID</th>
                <th>Phone</th>
                <th>Country</th>
              </tr>
            </thead>
            <tbody>
              {contactsB
                .filter((contact) =>
                  modalACheckbox ? contact.id % 2 === 0 : true
                )
                .map((contact) => (
                  //   <div
                  //     key={contact.id}
                  //     onClick={() => handleContactClick(contact)}
                  //   >
                  //     {contact.phone} - {contact.country.name}
                  //   </div>
                  <tr
                    key={contact.id}
                    onClick={() => handleContactClick(contact)}
                  >
                    <td>{contact.id}</td>
                    <td>{contact.phone}</td>
                    <td>{contact.country.name}</td>
                  </tr>
                ))}
            </tbody>
          </Table>
          {usContacts && (
            <Table striped bordered hover responsive>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Phone</th>
                  <th>Country</th>
                </tr>
              </thead>
              <tbody>
                {usContacts.map((c) => (
                  <tr key={c.id} onClick={() => handleContactClick(c)}>
                    <td>{c.id}</td>
                    <td>{c.phone}</td>
                    <td>{c.country.name}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
          <Button
            variant="secondary"
            onClick={() => setShowModalB(false)}
            className="mt-3"
            style={{ background: "#46139f", color: "white" }}
          >
            Close
          </Button>
        </Modal.Body>
        <Modal.Footer>
          <FormCheck
            label="Only even"
            checked={modalBCheckbox}
            onChange={() => setModalBCheckbox(!modalBCheckbox)}
          />
        </Modal.Footer>
      </Modal>

      {/* Modal C */}
      {selectedContact && (
        <Modal show={showModalC} onHide={() => setShowModalC(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Contact Details</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>ID: {selectedContact.id}</p>
            <p>Phone: {selectedContact.phone}</p>
            <p>Country: {selectedContact.country.name}</p>
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="secondary"
              onClick={() => setShowModalC(false)}
              style={{ background: "#46139f", color: "white" }}
            >
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </div>
  );
};

export default Problem2;
