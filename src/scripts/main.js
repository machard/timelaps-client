require("../index.html");
require("../assets/stylesheets/style.scss");

// TODO: Require assets here.
// require("../assets/product.png");

import EyeMap from "./components/EyeMap.js";
import React from "react";
import google from "./utils/google";

React.render(<EyeMap googleMapsApi={google.maps}/>, document.getElementById("main"));
