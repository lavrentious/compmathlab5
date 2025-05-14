import { Col, Container, Row } from "react-bootstrap";

import ApproximationVisualizationBlock from "../components/VisualizationBlock";

import ImportModal from "../components/ImportModal";
import InterpolationParamsBlock from "../components/InterpolationParamsBlock";
import PointInterpolationParamsBlock from "../components/PointInterpolationParamsBlock";
import PointsFormBlock from "../components/PointsFormBlock";
import PointSimulateButton from "../components/PointSimulateButton";
import SimulateButton from "../components/SimulateButton";

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
          <ApproximationVisualizationBlock />
        </Col>
      </Row>
    </Container>
  );
};

export default MainPage;
