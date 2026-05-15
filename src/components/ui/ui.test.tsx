import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Badge, Button, Card, CardContent, Input, Table, TableBody, TableCell, TableRow } from ".";

describe("ui primitives", () => {
  it("renders common primitives", () => {
    render(
      <Card>
        <CardContent>
          <Badge>Pro</Badge>
          <Input aria-label="Email" />
          <Button>Save</Button>
          <Table>
            <TableBody>
              <TableRow>
                <TableCell>Usage</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>,
    );

    expect(screen.getByText("Pro")).toBeTruthy();
    expect(screen.getByLabelText("Email")).toBeTruthy();
    expect(screen.getByRole("button", { name: "Save" })).toBeTruthy();
    expect(screen.getByText("Usage")).toBeTruthy();
  });
});
