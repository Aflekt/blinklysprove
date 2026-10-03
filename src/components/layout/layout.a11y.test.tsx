// @vitest-environment jsdom
import { render } from "@testing-library/react";
import type { ReactElement } from "react";
import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
import { Container } from "@/components/layout/container";
import { Grid } from "@/components/layout/grid";
import { Section } from "@/components/layout/section";
import { Inline, Stack } from "@/components/layout/stack";

const klosser: [string, ReactElement][] = [
  ["Container", <Container key="c">Innhold</Container>],
  [
    "Stack",
    <Stack as="ul" gap="m" key="s">
      <li>En</li>
      <li>To</li>
    </Stack>,
  ],
  [
    "Inline",
    <Inline key="i">
      <a href="#a">A</a>
      <a href="#b">B</a>
    </Inline>,
  ],
  [
    "Grid",
    <Grid cols={2} key="g">
      <p>En</p>
      <p>To</p>
    </Grid>,
  ],
  [
    "Section",
    <Section aria-labelledby="t" key="se">
      <h2 id="t">Tittel</h2>
    </Section>,
  ],
];

describe("layout-klossene", () => {
  it.each(klosser)("%s har ingen tilgjengelighetsfeil", async (_, kloss) => {
    const { container } = render(<main>{kloss}</main>);
    expect(await axe(container)).toHaveNoViolations();
  });
});
