import React, { Component } from 'react'
import {FormattedMessage, injectIntl} from 'react-intl'

export default @injectIntl
class Error404 extends Component {
  render() {
    return (
      <div>
        <h1>
          <FormattedMessage id="error.404.title"/>
        </h1>
        <p>
          <FormattedMessage id="error.404.message"/>
        </p>
      </div>
    )
  }
}