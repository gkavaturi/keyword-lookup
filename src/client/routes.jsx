import React from "react";
import PropTypes from "prop-types";
import Home from "./components/home";
import Upload from "./components/upload";
import { withRouter } from "react-router-dom";
import { renderRoutes } from "react-router-config";

const Root = ({ route, children }) => {
  return (
    <div>
      {renderRoutes(route.routes)}
      {children}
    </div>
  );
};

Root.propTypes = {
  route: PropTypes.object,
  children: PropTypes.object
};

const routes = [
  {
    path: "/",
    component: withRouter(Root),
    routes: [
      {
        path: "/",
        exact: true,
        component: Home
      },
      {
        path: "/upload",
        exact: true,
        component: Upload
      }
    ]
  }
];

export { routes };
