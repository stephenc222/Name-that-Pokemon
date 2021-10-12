import { render } from "@testing-library/react"
import Start from "./Start"

describe("Start", () => {
  it("renders successfully", async () => {
    const screen = render(<Start onStart={() => {}} />)
    expect(await screen.findByText("Name that Pokemon!")).toHaveTextContent(
      "Name that Pokemon!"
    )
  })
})
