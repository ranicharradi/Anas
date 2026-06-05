import { arc, curveBasis, line, pie, type DefaultArcObject, type PieArcDatum } from "d3-shape";

export interface DonutDatum {
  label: string;
  value: number;
  color: string;
}

export function ringPath({
  value,
  size,
  stroke,
}: {
  value: number;
  size: number;
  stroke: number;
}) {
  const radius = size / 2;
  const generator = arc<DefaultArcObject>()
    .innerRadius(radius - stroke)
    .outerRadius(radius)
    .cornerRadius(stroke / 2);

  return (
    generator({
      innerRadius: radius - stroke,
      outerRadius: radius,
      startAngle: 0,
      endAngle: (Math.max(0, Math.min(value, 100)) / 100) * Math.PI * 2,
    }) ?? ""
  );
}

export function donutPaths({
  data,
  size,
  stroke,
  padAngle = 0.035,
}: {
  data: DonutDatum[];
  size: number;
  stroke: number;
  padAngle?: number;
}) {
  const radius = size / 2;
  const generator = arc<PieArcDatum<DonutDatum>>()
    .innerRadius(radius - stroke)
    .outerRadius(radius)
    .cornerRadius(3);

  return pie<DonutDatum>()
    .value((d) => d.value)
    .sort(null)
    .padAngle(padAngle)(data)
    .map((d) => ({
      ...d.data,
      path: generator(d) ?? "",
      centroid: generator.centroid(d),
    }));
}

export function smoothLinePath(points: Array<[number, number]>) {
  return (
    line<[number, number]>()
      .x((d) => d[0])
      .y((d) => d[1])
      .curve(curveBasis)(points) ?? ""
  );
}
