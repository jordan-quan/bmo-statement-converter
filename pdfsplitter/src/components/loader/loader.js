import React from 'react';
import './loader.css';

const Loader = () => {
  return (
    <div id="animate">
      <div id="loading" className="lds-ring">
        <div>
        </div>
        <div>
        </div>
        <div>
        </div>
        <div>
        </div>
      </div>
    </div>
  );
}


export default Loader;
