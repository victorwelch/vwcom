using System;
using Microsoft.Extensions.Configuration;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata;

namespace vwcom.Models.DB
{
    public partial class vwcomContext : DbContext
    {
        public vwcomContext()
        {
        }

        public vwcomContext(DbContextOptions<vwcomContext> options)
            : base(options)
        {
        }

        /*
        public virtual DbSet<Blogs> Blogs { get; set; }
        public virtual DbSet<MigrationHistory> MigrationHistory { get; set; }
        public virtual DbSet<Posts> Posts { get; set; }
        */
        public virtual DbSet<TblCityIpv4Blocks> TblCityIpv4Blocks { get; set; }
        public virtual DbSet<TblCityIpv6Blocks> TblCityIpv6Blocks { get; set; }
        public virtual DbSet<TblCityLoc> TblCityLoc { get; set; }
        public virtual DbSet<UspValue> UspValue { get; set; }

        // Unable to generate entity type for table 'uiDemo.states'. Please see the warning messages.
        // Unable to generate entity type for table 'xfrin.cityIpv4Blocks'. Please see the warning messages.
        // Unable to generate entity type for table 'xfrin.cityIpv6Blocks'. Please see the warning messages.
        // Unable to generate entity type for table 'xfrin.cityLoc'. Please see the warning messages.

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            if (!optionsBuilder.IsConfigured)
            {
#warning To protect potentially sensitive information in your connection string, you should move it out of source code. See http://go.microsoft.com/fwlink/?LinkId=723263 for guidance on storing connection strings.
                optionsBuilder.UseSqlServer(Models.UtilVariables.Configuration.GetConnectionString("vwcomDatabase"));
            }
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            /*
            modelBuilder.HasAnnotation("ProductVersion", "2.2.6-servicing-10079");

            modelBuilder.Entity<Blogs>(entity =>
            {
                entity.HasKey(e => e.BlogId)
                    .HasName("PK_designPatt.Blogs");

                entity.ToTable("Blogs", "designPatt");
            });

            modelBuilder.Entity<MigrationHistory>(entity =>
            {
                entity.HasKey(e => new { e.MigrationId, e.ContextKey })
                    .HasName("PK_designPatt.__MigrationHistory");

                entity.ToTable("__MigrationHistory", "designPatt");

                entity.Property(e => e.MigrationId).HasMaxLength(150);

                entity.Property(e => e.ContextKey).HasMaxLength(300);

                entity.Property(e => e.Model).IsRequired();

                entity.Property(e => e.ProductVersion)
                    .IsRequired()
                    .HasMaxLength(32);
            });

            modelBuilder.Entity<Posts>(entity =>
            {
                entity.HasKey(e => e.PostId)
                    .HasName("PK_designPatt.Posts");

                entity.ToTable("Posts", "designPatt");

                entity.HasIndex(e => e.BlogId)
                    .HasName("IX_BlogId");

                entity.HasOne(d => d.Blog)
                    .WithMany(p => p.Posts)
                    .HasForeignKey(d => d.BlogId)
                    .HasConstraintName("FK_designPatt.Posts_designPatt.Blogs_BlogId");
            });
            */
            modelBuilder.Entity<TblCityIpv4Blocks>(entity =>
            {
                entity.HasKey(e => e.IpLowerBin);

                entity.ToTable("tblCityIpv4Blocks", "ipLoc");

                entity.Property(e => e.IpLowerBin)
                    .HasColumnName("ipLowerBin")
                    .HasMaxLength(4)
                    .ValueGeneratedNever();

                entity.Property(e => e.CreatedDtm)
                    .HasColumnName("createdDtm")
                    .HasDefaultValueSql("(getdate())");

                entity.Property(e => e.FkGeoNameId).HasColumnName("fkGeoNameId");

                entity.Property(e => e.IpLowerStr)
                    .IsRequired()
                    .HasColumnName("ipLowerStr")
                    .HasMaxLength(50)
                    .IsUnicode(false);

                entity.Property(e => e.IpUpperBin)
                    .IsRequired()
                    .HasColumnName("ipUpperBin")
                    .HasMaxLength(4);

                entity.Property(e => e.IpUpperStr)
                    .IsRequired()
                    .HasColumnName("ipUpperStr")
                    .HasMaxLength(50)
                    .IsUnicode(false);

                entity.Property(e => e.LatitudeNum)
                    .HasColumnName("latitudeNum")
                    .HasColumnType("numeric(10, 4)");

                entity.Property(e => e.LongitudeNum)
                    .HasColumnName("longitudeNum")
                    .HasColumnType("numeric(10, 4)");
            });

            modelBuilder.Entity<TblCityIpv6Blocks>(entity =>
            {
                entity.HasKey(e => e.IpLowerBin);

                entity.ToTable("tblCityIpv6Blocks", "ipLoc");

                entity.Property(e => e.IpLowerBin)
                    .HasColumnName("ipLowerBin")
                    .HasMaxLength(16)
                    .ValueGeneratedNever();

                entity.Property(e => e.CreatedDtm)
                    .HasColumnName("createdDtm")
                    .HasDefaultValueSql("(getdate())");

                entity.Property(e => e.FkGeoNameId).HasColumnName("fkGeoNameId");

                entity.Property(e => e.IpLowerStr)
                    .IsRequired()
                    .HasColumnName("ipLowerStr")
                    .HasMaxLength(100)
                    .IsUnicode(false);

                entity.Property(e => e.IpUpperBin)
                    .IsRequired()
                    .HasColumnName("ipUpperBin")
                    .HasMaxLength(16);

                entity.Property(e => e.IpUpperStr)
                    .IsRequired()
                    .HasColumnName("ipUpperStr")
                    .HasMaxLength(100)
                    .IsUnicode(false);

                entity.Property(e => e.LatitudeNum)
                    .HasColumnName("latitudeNum")
                    .HasColumnType("numeric(10, 4)");

                entity.Property(e => e.LongitudeNum)
                    .HasColumnName("longitudeNum")
                    .HasColumnType("numeric(10, 4)");
            });

            modelBuilder.Entity<TblCityLoc>(entity =>
            {
                entity.HasKey(e => e.PkGeoNameId);

                entity.ToTable("tblCityLoc", "ipLoc");

                entity.Property(e => e.PkGeoNameId)
                    .HasColumnName("pkGeoNameId")
                    .ValueGeneratedNever();

                entity.Property(e => e.CityStr)
                    .IsRequired()
                    .HasColumnName("cityStr")
                    .HasMaxLength(150)
                    .IsUnicode(false);

                entity.Property(e => e.ContinentStr)
                    .IsRequired()
                    .HasColumnName("continentStr")
                    .HasMaxLength(150)
                    .IsUnicode(false);

                entity.Property(e => e.CountryStr)
                    .IsRequired()
                    .HasColumnName("countryStr")
                    .HasMaxLength(150)
                    .IsUnicode(false);

                entity.Property(e => e.CountyPrefectCantonStr)
                    .IsRequired()
                    .HasColumnName("countyPrefectCantonStr")
                    .HasMaxLength(150)
                    .IsUnicode(false);

                entity.Property(e => e.CreatedDtm)
                    .HasColumnName("createdDtm")
                    .HasDefaultValueSql("(getdate())");

                entity.Property(e => e.StateProvinceStr)
                    .IsRequired()
                    .HasColumnName("stateProvinceStr")
                    .HasMaxLength(150)
                    .IsUnicode(false);
            });

            modelBuilder.Entity<UspValue>(entity =>
            {
                entity.HasKey(e => e.ValueStr);

                entity.ToTable("tblUspValue", "uiDemo");

                entity.Property(e => e.ValueStr)
                .IsRequired()
                .HasColumnName("valueStr")
                .IsUnicode(false);
            });
        }
    }
}
