import {DataProcessor} from '../interfaces';
import {fetchAocInput} from '../services/aoc.service.js';

/** The definition of a point in space. */
interface Point {
  xCoord: number
  yCoord: number
}

/** The definition of a segment outlined by two {@link Point}s. */
interface LineSegment {
  start: Point
  end: Point
}

/** The definition of a line outlined by two {@link Point}s. */
class Line implements LineSegment {
  markedPoints: Point[] = []
  start: Point
  end: Point

  constructor(start: Point, end: Point) {
    this.start = start
    this.end = end
  }

  /** Finds all {@link Point}s which are marked by the {@link Line}. */
  getMarkedPoints(): Point[] {
    if (this.markedPoints.length !== 0) {
      return this.markedPoints
    }
    const gradient = this.computeGradient()
    const yIntercept = this.computeYIntercept(this.start, gradient)
    if (this.start.xCoord !== this.end.xCoord) {
      for (let x = Math.min(this.start.xCoord, this.end.xCoord); x <= Math.max(this.start.xCoord, this.end.xCoord); x++) {
        let y = Math.round(gradient * x + yIntercept);
        this.markedPoints.push({xCoord: x, yCoord: y} as Point);
      }
    } else {
      for (let y = Math.min(this.start.yCoord, this.end.yCoord); y <= Math.max(this.start.yCoord, this.end.yCoord); y++) {
        this.markedPoints.push({xCoord: this.start.xCoord, yCoord: y} as Point);
      }
    }
    return this.markedPoints
  }

  private computeGradient(): number {
    if (this.start.xCoord === this.end.xCoord || this.start.yCoord === this.end.yCoord) {
      return 0
    }
    // Considering a line's equation is y = mx + b, we're trying to determine the slope (m).
    return (this.end.yCoord - this.start.yCoord) / (this.end.xCoord - this.start.xCoord)
  }

  private computeYIntercept(start: Point, gradient: number): number {
    if (gradient === 0) {
      return start.yCoord
    }
    // Considering a line's equation is y = mx + b, we're computing the Y intercept (b), which is the coordinate of y when x = 0.
    // Thus, b = y - mx
    return start.yCoord - gradient * start.xCoord
  }
}

const lineProcessor: DataProcessor<Line[]> = (value: string) => {
  const segmentPoints = value.split(/\n/) ?? [];
  const lines: Line[] =
    segmentPoints
      .filter(segmentPoint => !!segmentPoint)
      .map(points => {
        const [startPoint, endPoint] = points
          .replace('->', '')
          .trim()
          .split(/\s+/)
          .map(point => {
            const [xCoord, yCoord] = point.split(',').map(coord => Number(coord))
            return { xCoord: xCoord, yCoord: yCoord } as Point
          })
        return new Line(startPoint, endPoint)
      })
  if (lines.length === 0) {
    return Promise.reject(new Error('Input for Day 5 failed to be mapped'))
  }
  return Promise.resolve(lines)
}

const findDangerousPoints = (lines: Line[]): Promise<number> => {
  const overlappedPoints =
      Array.from(
        lines
          .flatMap(line => line.getMarkedPoints())
          .reduce((overlappedPoints, point) => {
            const key = `${point.xCoord}-${point.yCoord}`
            overlappedPoints.set(key, (overlappedPoints.get(key) || 0) + 1)
            return overlappedPoints
          }, new Map<string, number>())
          .entries())
        .filter(([_, count]) => count >= 2)
        .length
  return Promise.resolve(overlappedPoints)
}

const firstPart = (): void => {
  fetchAocInput(5, lineProcessor)
    .then(lines => lines.filter(lineSegment => lineSegment.start.xCoord === lineSegment.end.xCoord || lineSegment.start.yCoord === lineSegment.end.yCoord))
    .then(usableLines => findDangerousPoints(usableLines))
    .then(dangerousPoints => console.log('Vertical and horizontal line overlapping points: ' + dangerousPoints))
    .catch(err => console.error('Unable to find the vertical and horizontal line overlapping points', err))
}

const secondPart = (): void => {
  fetchAocInput(5, lineProcessor)
    .then(usableLines => findDangerousPoints(usableLines))
    .then(dangerousPoints => console.log('All dangerous points: ' + dangerousPoints))
    .catch(err => console.error('Unable to find all the overlapping points', err))
}

// Result: 6548
firstPart()
// Result: 19663
secondPart()