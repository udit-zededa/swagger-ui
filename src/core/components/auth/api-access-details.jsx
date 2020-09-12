import React from "react"
import PropTypes from "prop-types"

export default class AuthorizationParameters extends React.Component {
  close =() => {
    let { authActions } = this.props

    authActions.showDefinitions(false)
  }

  render() {
    let { authSelectors, authActions, getComponent, errSelectors, specSelectors, fn: { AST = {} } } = this.props
    let definitions = authSelectors.definitionsToAuthorize()
    const AuthsAccessDetails = getComponent("authsAccessDetails")

    return (
      <div>
        <div className="opblock-section-header">
            <h4>Security</h4>
        </div>
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
