import React, { Component } from "react"
import PropTypes from "prop-types"
import { getExtensions } from "core/utils"

export default class ModelType extends Component {
  static propTypes = {
    schema: PropTypes.object.isRequired,
    getComponent: PropTypes.func.isRequired,
    getConfigs: PropTypes.func.isRequired,
    name: PropTypes.string,
    displayName: PropTypes.string,
    depth: PropTypes.number
  }

  render(){
    let { schema } = this.props

    if(!schema || !schema.get) {
      // don't render if schema isn't correctly formed
      return <div></div>
    }

    let type = schema.get("type")
    let format = schema.get("format")
    let extensions = getExtensions(schema)
      .filter( ( v, key) => ["enum", "type", "format", "description", "$$ref"].indexOf(key) === -1 )
      .filterNot( (v, key) => extensions.has(key) )

    return <span className="model">
      <span className="prop">
            <span className="prop-type">{ type }</span>
            { format && <span className="prop-format">(${format})</span>}       
      </span>
    </span>
  }
}
