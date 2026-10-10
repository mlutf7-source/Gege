import type { Wall, Point } from '../../../../core/types';
import { COLORS } from '../colors';
import { computeCorner } from '../computeCorner';

export function drawRoundedCorner(
  ctx: CanvasRenderingContext2D,
    wallA: Wall,
      wallB: Wall,
        radiusWorld: number,
          toScreen: (p: Point) => Point,
            view: { zoom: number },
              scale: number,
                _selectedId: string | null,
                ): void {
                  const g = computeCorner(wallA, wallB, radiusWorld, toScreen, view.zoom, scale);
                    if (!g) return;

                      const {
                          O,
                              center: C,
                                  tangentA: TA,
                                      tangentB: TB,
                                          radius: R,
                                              startAngle,
                                                  endAngle,
                                                      ccw,
                                                        } = g;

                                                          // ✅ 1) Clip واسع: مستطيل يحيط بالركن + القوس كاملاً
                                                            //    (يحمي الشبكة والخلفية مع السماح بمنطقة القوس)
                                                              const clipR = R + 50; // هامش 50 بكسل
                                                                const clipX = Math.min(O.x, TA.x, TB.x, C.x) - clipR;
                                                                  const clipY = Math.min(O.y, TA.y, TB.y, C.y) - clipR;
                                                                    const clipW = Math.max(O.x, TA.x, TB.x, C.x) - clipX + clipR;
                                                                      const clipH = Math.max(O.y, TA.y, TB.y, C.y) - clipY + clipR;

                                                                        ctx.save();
                                                                          ctx.beginPath();
                                                                            ctx.rect(clipX, clipY, clipW, clipH);
                                                                              ctx.clip();

                                                                                // ✅ 2) احذف المنطقة الزائدة (بين O والقوس) + الجزء من الجدارين داخل هذه المنطقة
                                                                                  ctx.globalCompositeOperation = 'destination-out';
                                                                                    ctx.beginPath();
                                                                                      ctx.moveTo(O.x, O.y);
                                                                                        ctx.lineTo(TA.x, TA.y);
                                                                                          ctx.arc(C.x, C.y, R, startAngle, endAngle, ccw);
                                                                                            ctx.lineTo(O.x, O.y);
                                                                                              ctx.closePath();
                                                                                                ctx.fill();

                                                                                                  // ✅ 3) أعد رسم القوس بلون الجدار (هذا هو القوس الجديد)
                                                                                                    ctx.globalCompositeOperation = 'source-over';
                                                                                                      ctx.fillStyle = COLORS.wall;
                                                                                                        ctx.beginPath();
                                                                                                          ctx.moveTo(O.x, O.y);
                                                                                                            ctx.lineTo(TA.x, TA.y);
                                                                                                              ctx.arc(C.x, C.y, R, startAngle, endAngle, ccw);
                                                                                                                ctx.lineTo(O.x, O.y);
                                                                                                                  ctx.closePath();
                                                                                                                    ctx.fill();

                                                                                                                      ctx.restore();
                                                                                                                      }

                                                                                                                      // ═══════════════════════════════════════════════════════════
                                                                                                                      // المعاينة الذهبية
                                                                                                                      // ═══════════════════════════════════════════════════════════
                                                                                                                      export function drawRoundedCornerPreview(
                                                                                                                        ctx: CanvasRenderingContext2D,
                                                                                                                          wallA: Wall,
                                                                                                                            wallB: Wall,
                                                                                                                              radiusWorld: number,
                                                                                                                                toScreen: (p: Point) => Point,
                                                                                                                                  view: { zoom: number },
                                                                                                                                    scale: number,
                                                                                                                                    ): void {
                                                                                                                                      const g = computeCorner(wallA, wallB, radiusWorld, toScreen, view.zoom, scale);
                                                                                                                                        if (!g) return;

                                                                                                                                          const {
                                                                                                                                              O, center: C, tangentA: TA, tangentB: TB,
                                                                                                                                                  radius: R, startAngle, endAngle, ccw,
                                                                                                                                                    } = g;

                                                                                                                                                      ctx.save();
                                                                                                                                                        ctx.fillStyle = 'rgba(255, 200, 60, 0.35)';
                                                                                                                                                          ctx.strokeStyle = '#ffb800';
                                                                                                                                                            ctx.lineWidth = 2;
                                                                                                                                                              ctx.setLineDash([6, 4]);
                                                                                                                                                                ctx.beginPath();
                                                                                                                                                                  ctx.moveTo(O.x, O.y);
                                                                                                                                                                    ctx.lineTo(TA.x, TA.y);
                                                                                                                                                                      ctx.arc(C.x, C.y, R, startAngle, endAngle, ccw);
                                                                                                                                                                        ctx.closePath();
                                                                                                                                                                          ctx.fill();
                                                                                                                                                                            ctx.stroke();
                                                                                                                                                                              ctx.restore();
                                                                                                                                                                              }