import React from "react"
import PropTypes from "prop-types"

export const Property = ({ propKey, propVal, propClass }) => {
    return (
        <p className={ propClass }>
          { propKey }: { String(propVal) }</p>
    )
}
Property.propTypes = {
  propKey: PropTypes.string,
  propVal: PropTypes.any,
  propClass: PropTypes.string
}

export default Property
