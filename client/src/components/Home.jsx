import { React, useState } from "react";
import { Nav, Tab } from "react-bootstrap";
import Tab1 from "./Tabs/Tab1";
import Tab2 from "./Tabs/Tab2";

export default function Home() {
  const [activeKey, setActiveKey] = useState("Tab1");
  return (
    <div id="chatRoomBody">
      <Tab.Container
        id="controlled-tab-example"
        activeKey={activeKey}
        onSelect={(key) => {
          setActiveKey(key);
        }}
      >
        <Nav
          variant="tabs"
          style={{
            borderBottom: "1px solid black",
            backgroundColor: "#556052",
          }}
        >
          <Nav.Item>
            <Nav.Link
              style={
                activeKey === "Tab1"
                  ? {
                      fontSize: "1.3rem",
                      border: "1px solid black",
                      borderBottom: "0",
                      backgroundColor: "#f8f8f8",
                    }
                  : {
                      fontSize: "1.3rem",
                      border: "0",
                      color: "white",
                    }
              }
              eventKey="Tab1"
            >
              Tab1
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link
              className="privateNavbar"
              eventKey="Tab2"
              style={
                activeKey === "Tab2"
                  ? {
                      fontSize: "1.3rem",
                      border: "1px solid black",
                      borderBottom: "0",
                      backgroundColor: "#f8f8f8",
                    }
                  : {
                      fontSize: "1.3rem",
                      border: "0",
                      color: "white",
                    }
              }
            >
              Tab2
            </Nav.Link>
          </Nav.Item>
        </Nav>
        <Tab.Content>
          <Tab.Pane eventKey="Tab1">
            <Tab1 />
          </Tab.Pane>
          <Tab.Pane eventKey="Tab2">
            <Tab2 />
          </Tab.Pane>
        </Tab.Content>
      </Tab.Container>
    </div>
  );
}
