import { render } from "@testing-library/react"
import Play from "./Play"

describe("Play", () => {
  it("renders successfully", async () => {
    const screen = render(
      <Play
        timeRemaining={1000}
        choices={[]}
        onSelect={() => {}}
        total={10}
        numCorrect={1}
      />
    )
    expect(await screen.findByText("Time Remaining: 1")).toHaveTextContent(
      "Time Remaining: 1"
    )
  })
})
