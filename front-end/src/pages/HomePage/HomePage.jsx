import React from 'react'
import banner from '../../assets/images/banner.png';

function HomePage() {
  return (
    <>
      <div className='body' style={{ width: '100%', backgroundColor: '#efefef' }}>
        <div id="container" style={{ height: '1000px', width: '1270px', margin: "0 auto" }}>
          <img alt="example" src={banner} />
          {/* <SliderComponent arrImages={[slide1, slide2, slide3, slide4]} /> */}
        </div>
      </div>
    </>
  )
}

export default HomePage