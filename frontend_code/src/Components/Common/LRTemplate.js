import React from "react";

function LRTemplate({children}){
  return(
    <main className="lr-container">
      <section className="lr-container-left">
        <div className="lr-container-left-content">
          <h1>Learning will enhance your skill. Gain knowledge and enjoy.</h1>
          <p>This is a sample content</p>
        </div>
      </section>
      <section className="lr-container-right">
        {children}
      </section>
    </main>
  );
}

export default LRTemplate;
