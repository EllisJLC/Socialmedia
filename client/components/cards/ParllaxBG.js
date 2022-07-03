const ParallaxBG = ({url, children = 'Main Page'}) => {
    return (
    <div className="container-fluid"
        style = {{
            backgroundImage: "url( " + url + " )",
            backgroundAttachment: 'fixed',
            padding: '100px opx 75px 0px', //top-right-bottom-left
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'cover',
            backgroundPosition: 'center center',
            display: 'block',
        }}
    >
                <h1 className="display-1 font-weight-bold text-center py-5">
                    {children}
                </h1>

                {/* <p className="text-light">{children} This text will be display in image, image will not scroll with the page</p> */}
    </div>
    );
}

export default ParallaxBG;