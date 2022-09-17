import { describe, it } from 'vitest'
import { render } from '@testing-library/vue'
import TheWelcome from '../TheWelcome.vue'

describe('TheWelcome Component', () => {
  it('should render 5 given header', () => {
    const { findByText } = render(TheWelcome)

    findByText('Documentation')
    findByText('Tooling')
    findByText('Ecosystem')
    findByText('Community')
    findByText('Support Vue')
  })
})
