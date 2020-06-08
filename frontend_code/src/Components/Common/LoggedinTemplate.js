import React from "react";

import Header from "./Header";

function LoggedinTemplate({children}){
  return(
    <section>
      <Header/>
      {children}
    </section>
  );
}

export default LoggedinTemplate;
