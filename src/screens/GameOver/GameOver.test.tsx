import { render } from "@testing-library/react"
import GameOver from "./GameOver"

describe("GameOver", () => {
  it("renders successfully", async () => {
    const screen = render(
      <GameOver onRestart={() => {}} total={10} correct={1} />
    )
    expect(await screen.findByText("Final Score: 1 / 10")).toHaveTextContent(
      "Final Score: 1 / 10"
    )
  })
})
