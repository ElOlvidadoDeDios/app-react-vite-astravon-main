const contacts = [
    {
      id: 1,
      name: "Lith Pillzbabi",
      online: true,
      avatar: "https://i.pravatar.cc/50?img=1",
    },
    {
      id: 2,
      name: "Luz Marian VG",
      online: true,
      avatar: "https://i.pravatar.cc/50?img=2",
    },
    {
      id: 3,
      name: "Jose Selgueron Hurtado",
      online: true,
      avatar: "https://i.pravatar.cc/50?img=3",
    },
    {
      id: 4,
      name: "John Abraham Aguirre Carrasco",
      online: true,
      avatar: "https://i.pravatar.cc/50?img=4",
    },
    {
      id: 5,
      name: "Len Miniomlover",
      online: true,
      avatar: "https://i.pravatar.cc/50?img=5",
    },
    {
      id: 6,
      name: "Flor Maria Salas Huamani",
      online: true,
      avatar: "https://i.pravatar.cc/50?img=6",
    },
    {
      id: 7,
      name: "Luz Santi",
      online: true,
      avatar: "https://i.pravatar.cc/50?img=7",
    },
    {
      id: 8,
      name: "Huamani Tintaya Meli",
      online: true,
      avatar: "https://i.pravatar.cc/50?img=8",
    },    {
        id: 5,
        name: "Len Miniomlover",
        online: true,
        avatar: "https://i.pravatar.cc/50?img=5",
      },
      {
        id: 6,
        name: "Flor Maria Salas Huamani",
        online: true,
        avatar: "https://i.pravatar.cc/50?img=6",
      },
      {
        id: 7,
        name: "Luz Santi",
        online: true,
        avatar: "https://i.pravatar.cc/50?img=7",
      },
      {
        id: 8,
        name: "Huamani Tintaya Meli",
        online: true,
        avatar: "https://i.pravatar.cc/50?img=8",
      },
  ];
  
  export const ChatSidebar = () => {
    return (
      <div className="page-content-chat ">
        <h6 className="chat-title">Contactos(trabajando en ello...)</h6>
        {/*<ul className="chat-list">
          {contacts.map((contact) => (
            <li key={contact.id} className="chat-contact">
              <div className="chat-avatar-container">
                <img src={contact.avatar} alt={contact.name} className="chat-avatar" />
                <span className={`status-indicator ${contact.online ? "online" : ""}`}></span>
              </div>
              <span className="chat-name">{contact.name}</span>
            </li>
          ))}
        </ul>*/}
      </div>
    );
  };
  