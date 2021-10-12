import { render } from "@testing-library/react"
import App from "./App"

describe("App", () => {
  it("renders the initial Start phase successfully", async () => {
    expect(true).toBe(true)
    const screen = render(<App />)
    expect(await screen.findByText("Name that Pokemon!")).toHaveTextContent(
      "Name that Pokemon!"
    )
  })
})
