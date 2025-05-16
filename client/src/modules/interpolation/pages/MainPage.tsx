import { Col, Container, Row, Tab, Tabs } from "react-bootstrap";

import FiniteDifferencesBlock from "../components/FiniteDifferencesBlock";
import ImportModal from "../components/ImportModal";
import InterpolationParamsBlock from "../components/InterpolationParamsBlock";
import PointInterpolationParamsBlock from "../components/PointInterpolationParamsBlock";
import PointsFormBlock from "../components/PointsFormBlock";
import PointSimulateButton from "../components/PointSimulateButton";
import SimulateButton from "../components/SimulateButton";
import InterpolationVisualizationBlock from "../components/VisualizationBlock";

const MainPage = () => {
  return (
    <Container>
      <h2>Главная</h2>
      <Row>
        <Col md={6} lg={4}>
          <PointsFormBlock />
          <hr />
          <h5>Interpolation</h5>
          <InterpolationParamsBlock />
          <SimulateButton />
          <hr />
          <h5>Point interpolation</h5>
          <PointInterpolationParamsBlock />
          <PointSimulateButton />

          <ImportModal />
        </Col>
        <Col md={6} lg={8}>
          <Tabs defaultActiveKey="results">
            <Tab eventKey="results" title="Results">
              <InterpolationVisualizationBlock />
            </Tab>
            <Tab eventKey="fd" title="Finite differences">
              <FiniteDifferencesBlock />
            </Tab>
          </Tabs>
        </Col>
      </Row>
    </Container>
  );
};

export default MainPage;
