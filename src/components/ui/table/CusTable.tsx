import { Table } from "@chakra-ui/react";
import { useId, useState, type ReactNode } from "react";
import { LuArrowUp, LuArrowDown, LuArrowUpDown } from "react-icons/lu";
import { CusCheckbox } from "../inputs/CusCheckbox";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ColumnDef<T> {
  key: string;
  header: string;
  width?: string | number;
  align?: "left" | "center" | "right";
  sortable?: boolean;
  render?: (row: T, index: number) => ReactNode;
}

interface CusTableProps<T extends object> {
  data: T[];
  columns: ColumnDef<T>[];

  variant?: "line" | "outline";
  size?: "sm" | "md" | "lg";

  striped?: boolean;
  interactive?: boolean;
  stickyHeader?: boolean;
  showColumnBorder?: boolean;

  label?: string;
  isLoading?: boolean;
  emptyText?: string;
  caption?: string;
  maxH?: string;

  onRowClick?: (row: T, index: number) => void;

  // Row selection
  selectable?: boolean;
  selectedRows?: number[];
  onSelectionChange?: (indices: number[]) => void;

  // Header styling
  colorHeader?: string;
  colorTextHeader?: string;
  colorTextHeaderHover?: string;
  colorHeaderHover?: string;

  // Body row styling
  colorBody?: string;
  colorBodyHover?: string;
}

type SortDir = "asc" | "desc" | null;

// ─── Component ────────────────────────────────────────────────────────────────

export function CusTable<T extends object>({
  data,
  columns,
  variant = "line",
  size = "md",
  striped = false,
  interactive = false,
  stickyHeader = false,
  showColumnBorder = false,
  label,
  isLoading = false,
  emptyText = "Ma'lumot topilmadi",
  caption,
  maxH,
  onRowClick,
  selectable = false,
  selectedRows,
  onSelectionChange,
  colorHeader,
  colorTextHeader,
  colorTextHeaderHover,
  colorHeaderHover,
  colorBody,
  colorBodyHover,
}: CusTableProps<T>) {
  const uid = useId().replace(/:/g, "");
  const scope = `cus-table-${uid}`;

  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<SortDir>(null);

  // internal selection state (uncontrolled fallback)
  const [internalSelected, setInternalSelected] = useState<number[]>([]);
  const selected = selectedRows ?? internalSelected;
  const setSelected = (next: number[]) => {
    setInternalSelected(next);
    onSelectionChange?.(next);
  };

  function handleSort(key: string) {
    if (sortKey !== key) {
      setSortKey(key);
      setSortDir("asc");
    } else if (sortDir === "asc") setSortDir("desc");
    else {
      setSortKey(null);
      setSortDir(null);
    }
  }

  const sorted = [...data].sort((a, b) => {
    if (!sortKey || !sortDir) return 0;
    const aVal = (a as Record<string, unknown>)[sortKey];
    const bVal = (b as Record<string, unknown>)[sortKey];
    if (aVal == null) return 1;
    if (bVal == null) return -1;
    const cmp = String(aVal).localeCompare(String(bVal), undefined, {
      numeric: true,
    });
    return sortDir === "asc" ? cmp : -cmp;
  });

  const isEmpty = !isLoading && sorted.length === 0;

  // selection helpers
  const allSelected =
    sorted.length > 0 && sorted.every((_, i) => selected.includes(i));
  const someSelected = selected.length > 0 && !allSelected;

  function toggleAll() {
    setSelected(allSelected ? [] : sorted.map((_, i) => i));
  }
  function toggleRow(i: number) {
    setSelected(
      selected.includes(i) ? selected.filter((x) => x !== i) : [...selected, i],
    );
  }

  const colSpanTotal = columns.length + (selectable ? 1 : 0);

  return (
    <>
      {label && (
        <p
          style={{
            fontSize: 15,
            fontWeight: 600,
            color: "var(--text-default)",
            marginBottom: 8,
          }}
        >
          {label}
        </p>
      )}
      <style>{`
        .${scope} th { ${colorHeader ? `background:${colorHeader};` : ""} ${colorTextHeader ? `color:${colorTextHeader};` : ""} }
        .${scope} th:hover { ${colorHeaderHover ? `background:${colorHeaderHover};` : ""} ${colorTextHeaderHover ? `color:${colorTextHeaderHover};` : ""} }
        .${scope} tbody tr { ${colorBody ? `background:${colorBody};` : ""} }
        .${scope} tbody tr:hover { ${colorBodyHover ? `background:${colorBodyHover};` : ""} }
      `}</style>

      <Table.ScrollArea
        maxH={maxH}
        borderRadius="md"
        style={{ width: "100%" }}
        className={scope}
      >
        <Table.Root
          variant={variant}
          size={size}
          striped={striped}
          interactive={interactive || !!onRowClick}
          stickyHeader={stickyHeader}
          showColumnBorder={showColumnBorder}
        >
          {caption && (
            <Table.Caption style={{ color: "var(--text-muted)", fontSize: 12 }}>
              {caption}
            </Table.Caption>
          )}

          {/* ── Header ── */}
          <Table.Header>
            <Table.Row>
              {selectable && (
                <Table.ColumnHeader width={14} style={{}}>
                  <CusCheckbox
                    checked={allSelected}
                    indeterminate={someSelected}
                    onChange={() => toggleAll()}
                    size="sm"
                  />
                </Table.ColumnHeader>
              )}
              {columns.map((col) => (
                <Table.ColumnHeader
                  key={col.key}
                  width={col.width}
                  textAlign={col.align ?? "left"}
                  style={{
                    cursor: col.sortable ? "pointer" : undefined,
                    userSelect: col.sortable ? "none" : undefined,
                    color: "var(--text-muted)",
                    fontSize: 11,
                    fontWeight: 600,
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                  }}
                  onClick={col.sortable ? () => handleSort(col.key) : undefined}
                >
                  <span
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 4,
                    }}
                  >
                    {col.header}
                    {col.sortable && (
                      <span style={{ opacity: 0.5, display: "flex" }}>
                        {sortKey === col.key ? (
                          sortDir === "asc" ? (
                            <LuArrowUp size={11} />
                          ) : (
                            <LuArrowDown size={11} />
                          )
                        ) : (
                          <LuArrowUpDown size={11} />
                        )}
                      </span>
                    )}
                  </span>
                </Table.ColumnHeader>
              ))}
            </Table.Row>
          </Table.Header>

          {/* ── Body ── */}
          <Table.Body>
            {isLoading ? (
              <Table.Row>
                <Table.Cell
                  colSpan={colSpanTotal}
                  textAlign="center"
                  style={{
                    padding: "40px 0",
                    color: "var(--text-muted)",
                    fontSize: 13,
                  }}
                >
                  Yuklanmoqda...
                </Table.Cell>
              </Table.Row>
            ) : isEmpty ? (
              <Table.Row>
                <Table.Cell
                  colSpan={colSpanTotal}
                  textAlign="center"
                  style={{
                    padding: "40px 0",
                    color: "var(--text-muted)",
                    fontSize: 13,
                  }}
                >
                  {emptyText}
                </Table.Cell>
              </Table.Row>
            ) : (
              sorted.map((row, rowIdx) => {
                const isSelected = selected.includes(rowIdx);
                return (
                  <Table.Row
                    key={rowIdx}
                    onClick={
                      onRowClick ? () => onRowClick(row, rowIdx) : undefined
                    }
                    style={{
                      cursor: onRowClick ? "pointer" : undefined,
                      color: "var(--text-default)",
                      background: isSelected ? "var(--bg-hover)" : undefined,
                    }}
                  >
                    {selectable && (
                      <Table.Cell onClick={(e) => e.stopPropagation()}>
                        <div onClick={(e) => e.stopPropagation()}>
                          <CusCheckbox
                            checked={isSelected}
                            onChange={() => toggleRow(rowIdx)}
                            size="sm"
                          />
                        </div>
                      </Table.Cell>
                    )}
                    {columns.map((col) => (
                      <Table.Cell
                        key={col.key}
                        textAlign={col.align ?? "left"}
                        style={{ fontSize: 13 }}
                      >
                        {col.render
                          ? col.render(row, rowIdx)
                          : String(
                              (row as Record<string, unknown>)[col.key] ?? "—",
                            )}
                      </Table.Cell>
                    ))}
                  </Table.Row>
                );
              })
            )}
          </Table.Body>
        </Table.Root>
      </Table.ScrollArea>
    </>
  );
}
