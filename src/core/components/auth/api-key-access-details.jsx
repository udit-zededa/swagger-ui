import React from "react"
import PropTypes from "prop-types"

export default class ApiKeyAuthAccessDetails extends React.Component {
  static propTypes = {
    authorized: PropTypes.object,
    getComponent: PropTypes.func.isRequired,
    errSelectors: PropTypes.object.isRequired,
    schema: PropTypes.object.isRequired,
    name: PropTypes.string.isRequired,
    onChange: PropTypes.func
  }

  constructor(props, context) {
    super(props, context)
    let { name, schema } = this.props
    let value = this.getValue()

    this.state = {
      name: name,
      schema: schema,
      value: value
    }
  }

  getValue () {
    let { name, authorized } = this.props

    return authorized && authorized.getIn([name, "value"])
  }

  onChange =(e) => {
    let { onChange } = this.props
    let value = e.target.value
    let newState = Object.assign({}, this.state, { value: value })

    this.setState(newState)
    onChange(newState)
  }

  render() {
    let { schema, getComponent, errSelectors, name } = this.props
    const Input = getComponent("Input")
    const Row = getComponent("Row")
    const Col = getComponent("Col")
    const AuthError = getComponent("authError")
    const Markdown = getComponent("Markdown", true)
    const JumpToPath = getComponent("JumpToPath", true)
    let value = this.getValue()
    let errors = errSelectors.allErrors().filter( err => err.get("authId") === name)

    return (
        <div className="table-container">
            <table className="parameters">
              <thead>
                <tr>
                  <th className="col_header parameters-col_security_type">Security Type</th>
                  <th className="col_header parameters-col_description">Description</th>
                  <th className="col_header parameters-col_name">Name</th>
                  <th className="col_header parameters-col_in">In</th>
                  <th className="col_header parameters-col_scope">Scopes</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                      <code>{ name || schema.get("name") }</code>&nbsp;
                      <h4>(apiKey)</h4>
                  </td>
                  <td>
                      <Markdown source={ schema.get("description") } />
                  </td>
                  <td>
                    <code>{ schema.get("name") }</code>
                  </td>
                  <td>
                    <code>{ schema.get("in") }</code>
                  </td>
                  <td>
                    
                  </td>
                  </tr>
              </tbody>
            </table>
        </div>
    )
  }
}
