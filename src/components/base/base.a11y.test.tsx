// @vitest-environment jsdom
import { render, screen } from "@testing-library/react";
import type { ReactElement } from "react";
import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
import { Button } from "@/components/base/button";
import { Input, Label } from "@/components/base/input";
import { Card, Lead } from "@/components/ui/card";

const klosser: [string, ReactElement][] = [
  ["Button", <Button key="b">Start blinklysprøven</Button>],
  [
    "Label og Input",
    <form key="f">
      <Label htmlFor="navn">Fullt navn</Label>
      <Input id="navn" />
    </form>,
  ],
  [
    "Card og Lead",
    <Card key="c">
      <h2>Velg kjøretøy</h2>
      <Lead>Velg klokt.</Lead>
    </Card>,
  ],
];

describe("base- og ui-klossene", () => {
  it.each(klosser)("%s har ingen tilgjengelighetsfeil", async (_, kloss) => {
    const { container } = render(<main>{kloss}</main>);
    expect(await axe(container)).toHaveNoViolations();
  });

  it("Button sender ikke skjemaet med mindre den får type submit", () => {
    render(<Button>Ny runde</Button>);
    expect(screen.getByRole("button", { name: "Ny runde" }).getAttribute("type")).toBe("button");
  });

  it("Label knytter teksten til feltet", () => {
    render(
      <>
        <Label htmlFor="navn">Fullt navn</Label>
        <Input id="navn" />
      </>,
    );
    expect(screen.getByLabelText("Fullt navn")).toBeTruthy();
  });
});
