import React from "react"
import PropTypes from "prop-types"

export default class ApiAccessDetails extends React.Component {
  static propTypes = {
    operationProps: PropTypes.instanceOf(Iterable).isRequired,
  }
  static defaultProps = {
    operationProps: null,
  }
  close =() => {
    let { authActions } = this.props

    authActions.showDefinitions(false)
  }

  render() {
    let { authSelectors, authActions, getComponent, operationProps,errSelectors, specSelectors, fn: { AST = {} } } = this.props
    let security = operationProps.get("security")
    let definitions = authSelectors.definitionsForRequirements(security)
    const AuthsAccessDetails = getComponent("authsAccessDetails")

    return (
      <div>
        <div className="modal-ux-content">
            {
                definitions.valueSeq().map(( definition, key ) => {
                    return <AuthsAccessDetails key={ key }
                                  AST={AST}
                                  definitions={ definition }
                                  getComponent={ getComponent }
                                  errSelectors={ errSelectors }
                                  authSelectors={ authSelectors }
                                  authActions={ authActions }
                                  specSelectors={ specSelectors }/>
                })
            }
        </div>
      </div>
    )
  }

  static propTypes = {
    fn: PropTypes.object.isRequired,
    getComponent: PropTypes.func.isRequired,
    authSelectors: PropTypes.object.isRequired,
    specSelectors: PropTypes.object.isRequired,
    errSelectors: PropTypes.object.isRequired,
    authActions: PropTypes.object.isRequired,
  }
}
